#!/bin/sh

if [ "$ENVIRONMENT" = "production" ]; then
    envsubst '\$DOMAIN' < /etc/nginx/nginx.conf.prod > /etc/nginx/nginx.conf
else
    envsubst '\$DOMAIN' < /etc/nginx/nginx.conf.dev > /etc/nginx/nginx.conf
fi

exec "$@"
