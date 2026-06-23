<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContactAdminEmail extends Mailable
{
    public function __construct(
        public string $nom,
        public string $email,
        public string $sujet,
        public string $contenu,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '[Contact] ' . $this->sujet . ' — de ' . $this->nom);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact_admin');
    }
}
