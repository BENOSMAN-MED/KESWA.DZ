<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationKasewa;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /notifications
    public function index(Request $request)
    {
        $notifications = NotificationKasewa::where('utilisateur_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    // GET /notifications/non-lues
    public function nonLues(Request $request)
    {
        $notifications = NotificationKasewa::where('utilisateur_id', $request->user()->id)
            ->where('lu', false)
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'count'         => $notifications->count(),
            'notifications' => $notifications,
        ]);
    }

    // PUT /notifications/{notification}/lire
    public function marquerLu(Request $request, NotificationKasewa $notification)
    {
        if ($notification->utilisateur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $notification->update(['lu' => true]);

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    // PUT /notifications/lire-tout
    public function marquerToutLu(Request $request)
    {
        NotificationKasewa::where('utilisateur_id', $request->user()->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['message' => 'Toutes les notifications sont marquées comme lues.']);
    }
}
