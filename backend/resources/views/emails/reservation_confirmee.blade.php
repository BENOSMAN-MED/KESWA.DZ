@extends('emails.layout')
@section('titre', 'Réservation confirmée ✅')
@section('contenu')
<p class="greeting">Bonne nouvelle, {{ $locataire_nom }} !</p>
<p class="content">Votre réservation a été <span class="badge">confirmée</span> par le propriétaire. Un contrat de location a été généré automatiquement.</p>
<div class="card">
  <p><strong>Tenue :</strong> {{ $tenue_titre }}</p>
  <p><strong>Propriétaire :</strong> {{ $proprietaire_nom }}</p>
  <p><strong>Période :</strong> du {{ $date_debut }} au {{ $date_fin }}</p>
  <p><strong>Montant total :</strong> {{ $montant }} DA</p>
  <p><strong>Caution :</strong> {{ $caution }} DA</p>
</div>
<p class="content"><strong>Prochaine étape :</strong> Effectuez votre paiement (Barid Mobile, CCP ou CIB) pour confirmer définitivement la location.</p>
<a href="http://localhost:5173/dashboard/renter" class="btn btn-gold">Payer maintenant</a>
<hr class="divider"/>
<p class="content" style="font-size:13px; color:#888;">Le contrat de location est consultable dans votre tableau de bord.</p>
@endsection
