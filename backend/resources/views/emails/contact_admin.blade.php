@extends('emails.layout')
@section('titre', 'Nouveau message via le formulaire contact')
@section('contenu')
<p class="greeting">Nouvelle demande de contact reçue</p>
<div class="card">
  <p><strong>Nom :</strong> {{ $nom }}</p>
  <p><strong>Email :</strong> <a href="mailto:{{ $email }}">{{ $email }}</a></p>
  <p><strong>Sujet :</strong> {{ $sujet }}</p>
  <p><strong>Message :</strong></p>
  <p style="color:#555; white-space:pre-line;">{{ $contenu }}</p>
</div>
<a href="mailto:{{ $email }}" class="btn">Répondre à {{ $nom }}</a>
@endsection
