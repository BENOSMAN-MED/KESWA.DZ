@extends('emails.layout')
@section('titre', 'Paiement validé 💳')
@section('contenu')
<p class="greeting">Bonjour {{ $locataire_nom }},</p>
<p class="content">Votre paiement a été <span class="badge">validé</span> par l'administration. Votre location est maintenant <strong>en cours</strong>.</p>
<div class="card">
  <p><strong>Tenue :</strong> {{ $tenue_titre }}</p>
  <p><strong>Montant payé :</strong> {{ $montant }} DA</p>
  <p><strong>Mode de paiement :</strong> {{ $mode }}</p>
  <p><strong>Référence :</strong> {{ $reference }}</p>
  <p><strong>Période :</strong> du {{ $date_debut }} au {{ $date_fin }}</p>
</div>
<p class="content">Présentez-vous chez le propriétaire à la date convenue pour récupérer la tenue.</p>
<a href="http://localhost:5173/dashboard/renter" class="btn">Mon tableau de bord</a>
@endsection
