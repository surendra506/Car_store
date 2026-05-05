FROM devopselsner/magento2:apache2-composer2-php8.3
RUN service apache2 start && \
    useradd surendra && \
    usermod -a -G www-data surendra && \
    usermod -u 1000 surendra && \
    groupmod -g 1000 surendra && \
    chown -R surendra:www-data /var/www/html
CMD ["apachectl", "-D", "FOREGROUND"]
WORKDIR /var/www/html
