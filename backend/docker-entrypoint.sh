#!/bin/sh
set -e

echo "Rodando migrations..."
php artisan migrate --force

echo "Rodando seeders..."
php artisan db:seed --force

echo "Iniciando PHP-FPM..."
exec php-fpm
