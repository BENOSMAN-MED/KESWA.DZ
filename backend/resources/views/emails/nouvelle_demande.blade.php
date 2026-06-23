@extends('emails.layout')
@section('titre', 'Nouvelle demande de location')
@section('contenu')
<p class="greeting">Bonjour {{ $proprietaire_nom }},</p>
<p class="content">Vous avez reçu une nouvelle demande de location sur KASEWA.DZ.</p>
<div class="card">
  <p><strong>Tenue :</strong> {{ $tenue_titre }}</p>
  <p><strong>Locataire :</strong> {{ $locataire_nom }}</p>
  <p><strong>Période :</strong> du {{ $date_debut }} au {{ $date_fin }}</p>
  <p><strong>Montant total :</strong> {{ $montant }} DA</p>
</div>
<p class="content">Connectez-vous à votre tableau de bord pour <strong>confirmer ou refuser</strong> cette demande.</p>
<a href="http://localhost:5173/dashboard/owner" class="btn">Voir la demande</a>
<hr class="divider"/>
<p class="content" style="font-size:13px; color:#888;">Si vous ne reconnaissez pas cette demande, ignorez cet email.</p>
@endsection
