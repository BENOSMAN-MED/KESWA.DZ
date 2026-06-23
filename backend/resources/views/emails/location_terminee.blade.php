@extends('emails.layout')
@section('titre', 'Location terminée ⭐')
@section('contenu')
<p class="greeting">Bonjour {{ $locataire_nom }},</p>
<p class="content">Votre location est <strong>terminée</strong>. La caution de <strong>{{ $caution }} DA</strong> vous sera remboursée dans les meilleurs délais.</p>
<div class="card">
  <p><strong>Tenue :</strong> {{ $tenue_titre }}</p>
  <p><strong>Période :</strong> du {{ $date_debut }} au {{ $date_fin }}</p>
  <p><strong>Caution remboursée :</strong> {{ $caution }} DA</p>
</div>
<p class="content">Partagez votre expérience en laissant une évaluation — cela aide la communauté KASEWA.DZ !</p>
<a href="http://localhost:5173/dashboard/renter" class="btn btn-gold">Laisser une évaluation</a>
@endsection
