@extends('emails.layout')
@section('titre', 'Nous avons bien reçu votre message')
@section('contenu')
<p class="greeting">Bonjour {{ $nom }},</p>
<p class="content">Merci de nous avoir contactés ! Nous avons bien reçu votre message et nous vous répondrons dans les <strong>24 à 48 heures</strong>.</p>
<div class="card">
  <p><strong>Sujet :</strong> {{ $sujet }}</p>
  <p><strong>Votre message :</strong></p>
  <p style="color:#666; font-style:italic;">{{ $contenu }}</p>
</div>
<p class="content">En attendant, vous pouvez consulter notre catalogue ou nous rejoindre sur la plateforme.</p>
<a href="http://localhost:5173/catalogue" class="btn">Parcourir le catalogue</a>
<hr class="divider"/>
<p class="content" style="font-size:13px; color:#888;">L'équipe KASEWA.DZ — Tlemcen, Algérie</p>
@endsection
