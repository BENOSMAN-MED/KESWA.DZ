#!/usr/bin/env bash
set -e

php artisan migrate --force
php artisan storage:link 2>/dev/null || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue worker en arrière-plan (emails, notifications)
php artisan queue:work --daemon --tries=3 --sleep=3 &

php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
