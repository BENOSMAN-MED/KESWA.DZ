<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactAdminEmail;
use App\Mail\ContactReponseAutoEmail;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function envoyer(Request $request)
    {
        $data = $request->validate([
            'nom'     => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'sujet'   => 'required|string|max:200',
            'message' => 'required|string|max:2000',
        ]);

        ContactMessage::create($data);

        try {
            Mail::to($data['email'])->queue(new ContactReponseAutoEmail(
                nom:     $data['nom'],
                sujet:   $data['sujet'],
                contenu: $data['message'],
            ));

            $adminEmail = config('mail.admin_email', env('MAIL_ADMIN', 'admin@kasewa.dz'));
            Mail::to($adminEmail)->queue(new ContactAdminEmail(
                nom:     $data['nom'],
                email:   $data['email'],
                sujet:   $data['sujet'],
                contenu: $data['message'],
            ));
        } catch (\Exception $e) {
            // Email failed but message is saved in DB
        }

        return response()->json(['message' => 'Votre message a été envoyé. Vous recevrez une réponse dans les 24-48h.']);
    }
}
