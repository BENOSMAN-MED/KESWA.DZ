<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ReservationAnnuleeEmail extends Mailable
{
    public function __construct(
        public string $destinataire_nom,
        public string $tenue_titre,
        public string $date_debut,
        public string $date_fin,
        public string $annule_par,
        public bool   $caution_remboursee,
        public string $caution,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Réservation annulée — ' . $this->tenue_titre);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.reservation_annulee');
    }
}
