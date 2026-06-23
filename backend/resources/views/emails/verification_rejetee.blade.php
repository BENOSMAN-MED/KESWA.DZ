@extends('emails.layout')
@section('titre', 'Vérification rejetée')
@section('contenu')
<p class="greeting">Bonjour {{ $nom }},</p>
<p class="content">Votre vérification d'identité a été <span class="badge badge-red">rejetée</span>.</p>
<div class="card">
  <p><strong>Motif :</strong> {{ $motif }}</p>
</div>
<p class="content">Vous pouvez soumettre à nouveau vos documents en veillant à ce qu'ils soient :</p>
<ul style="color:#444; font-size:14px; line-height:2;">
  <li>Lisibles et non flous</li>
  <li>Valides (non expirés)</li>
  <li>Correspondant à votre profil</li>
</ul>
<a href="http://localhost:5173/profil" class="btn btn-gold">Resoumettre mes documents</a>
@endsection
