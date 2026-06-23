<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class VerificationValideeEmail extends Mailable
{
    public function __construct(
        public string $nom,
        public string $role,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '✅ Votre identité a été vérifiée — KASEWA.DZ');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verification_validee');
    }
}
