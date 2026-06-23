<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class VerificationRejeteeEmail extends Mailable
{
    public function __construct(
        public string $nom,
        public string $motif,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Vérification rejetée — KASEWA.DZ');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verification_rejetee');
    }
}
