<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // 10 tentatives / minute par IP pour connexion et inscription
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Trop de tentatives. Veuillez réessayer dans une minute.',
                ], 429);
            });
        });

        // 5 messages / heure par IP pour le formulaire de contact
        RateLimiter::for('contact', function (Request $request) {
            return Limit::perHour(5)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Vous avez envoyé trop de messages. Réessayez dans une heure.',
                ], 429);
            });
        });

        // 60 requêtes / minute pour l'API générale (par utilisateur ou IP)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
