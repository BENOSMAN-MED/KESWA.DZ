@extends('emails.layout')
@section('titre', 'Identité vérifiée ✅')
@section('contenu')
<p class="greeting">Félicitations, {{ $nom }} !</p>
<p class="content">Votre identité a été <span class="badge">vérifiée</span> avec succès. Votre compte est maintenant entièrement activé.</p>
<p class="content">Vous pouvez maintenant :</p>
<ul style="color:#444; font-size:15px; line-height:2;">
  @if($role === 'proprietaire')
  <li>Publier des annonces de location</li>
  <li>Gérer votre calendrier de disponibilité</li>
  <li>Recevoir des paiements sécurisés</li>
  @else
  <li>Réserver des tenues traditionnelles</li>
  <li>Effectuer des paiements sécurisés</li>
  <li>Laisser des évaluations</li>
  @endif
</ul>
<a href="http://localhost:5173/catalogue" class="btn">Découvrir le catalogue</a>
@endsection
