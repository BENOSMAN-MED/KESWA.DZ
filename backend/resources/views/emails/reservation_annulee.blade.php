@extends('emails.layout')
@section('titre', 'Réservation annulée')
@section('contenu')
<p class="greeting">Bonjour {{ $destinataire_nom }},</p>
<p class="content">La réservation suivante a été <span class="badge badge-red">annulée</span>.</p>
<div class="card">
  <p><strong>Tenue :</strong> {{ $tenue_titre }}</p>
  <p><strong>Période :</strong> du {{ $date_debut }} au {{ $date_fin }}</p>
  <p><strong>Annulée par :</strong> {{ $annule_par }}</p>
</div>
@if($caution_remboursee)
<p class="content">La caution de <strong>{{ $caution }} DA</strong> vous sera remboursée dans les meilleurs délais.</p>
@endif
<a href="http://localhost:5173/catalogue" class="btn">Parcourir d'autres tenues</a>
@endsection
