<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class LocationTermineeEmail extends Mailable
{
    public function __construct(
        public string $locataire_nom,
        public string $tenue_titre,
        public string $date_debut,
        public string $date_fin,
        public string $caution,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '⭐ Location terminée — ' . $this->tenue_titre);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.location_terminee');
    }
}
