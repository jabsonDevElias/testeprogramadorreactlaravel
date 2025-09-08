FROM php:8.2-fpm

WORKDIR /var/www/html

# Instala dependências do sistema e extensões PHP necessárias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Instala o Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia os arquivos do projeto
COPY . .

# Instala dependências PHP
RUN composer install --no-interaction --optimize-autoloader

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000

CMD ["sh", "-c", "php artisan migrate --force && php artisan db:seed --force && php-fpm"]
