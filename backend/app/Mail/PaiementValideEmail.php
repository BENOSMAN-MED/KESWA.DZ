<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PaiementValideEmail extends Mailable
{
    public function __construct(
        public string $locataire_nom,
        public string $tenue_titre,
        public string $montant,
        public string $mode,
        public string $reference,
        public string $date_debut,
        public string $date_fin,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '💳 Paiement validé — ' . $this->tenue_titre);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.paiement_valide');
    }
}
