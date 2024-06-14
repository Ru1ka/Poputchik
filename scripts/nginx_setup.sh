#!/bin/sh

if [ "$ENVIRONMENT" = "production" ]; then
    envsubst '\$DOMAIN \$SERVER_PORT \$FRONTEND_PORT' < /etc/nginx/nginx.conf.prod > /etc/nginx/nginx.conf
else
    envsubst '\$DOMAIN \$SERVER_PORT \$FRONTEND_PORT' < /etc/nginx/nginx.conf.dev > /etc/nginx/nginx.conf
fi

exec nginx -g 'daemon off;'
