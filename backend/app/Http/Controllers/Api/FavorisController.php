<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class FavorisController extends Controller
{
    public function mes(Request $request)
    {
        $ids = $request->user()->favoris ?? [];

        if (empty($ids)) {
            return response()->json([]);
        }

        /** @var Builder $query */
        $query = Tenue::query()->whereIn('id', $ids)->where('statut', 'disponible');
        $query->with(['photos' => fn($q) => $q->orderBy('principale', 'desc')->limit(1)]);
        $query->withCount('evaluations as nombre_evaluations');
        $query->withAvg('evaluations as note_moyenne', 'note');
        $tenues = $query->get();

        return response()->json($tenues);
    }

    public function toggle(Request $request, Tenue $tenue)
    {
        $user    = $request->user();
        $favoris = $user->favoris ?? [];
        $id      = $tenue->id;

        if (in_array($id, $favoris)) {
            $favoris = array_values(array_filter($favoris, fn($f) => $f !== $id));
            $action  = 'removed';
        } else {
            $favoris[] = $id;
            $action    = 'added';
        }

        $user->update(['favoris' => $favoris]);

        return response()->json(['action' => $action, 'favoris' => $favoris]);
    }
}
