<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PaiementRejeteEmail extends Mailable
{
    public function __construct(
        public string $locataire_nom,
        public string $tenue_titre,
        public string $motif,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Paiement rejeté — ' . $this->tenue_titre);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.paiement_rejete');
    }
}
