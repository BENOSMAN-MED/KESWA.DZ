<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContactReponseAutoEmail extends Mailable
{
    public function __construct(
        public string $nom,
        public string $sujet,
        public string $contenu,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Nous avons bien reçu votre message — KASEWA.DZ');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact_reponse_auto');
    }
}
