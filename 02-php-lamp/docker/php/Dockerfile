FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql mysqli

# Opcional: activar rewrite si lo necesitas
RUN a2enmod rewrite

COPY php.ini /usr/local/etc/php/php.ini

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
