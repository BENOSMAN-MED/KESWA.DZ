@extends('emails.layout')
@section('titre', 'Paiement rejeté')
@section('contenu')
<p class="greeting">Bonjour {{ $locataire_nom }},</p>
<p class="content">Votre paiement a été <span class="badge badge-red">rejeté</span> par l'administration et la réservation a été annulée.</p>
<div class="card">
  <p><strong>Tenue :</strong> {{ $tenue_titre }}</p>
  <p><strong>Motif :</strong> {{ $motif }}</p>
</div>
<p class="content">Vous pouvez soumettre un nouveau paiement ou contacter le support si vous pensez qu'il s'agit d'une erreur.</p>
<a href="http://localhost:5173/contact" class="btn btn-gold">Contacter le support</a>
@endsection
