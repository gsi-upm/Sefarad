#!/bin/sh

# Copy bower dependencies when using -v $PWD/:/usr/src/app
if [ -f /.dockerenv ]; then
    cp -a /usr/src/bower_components /usr/src/app/;
fi

bower link --allow-root
bower link $APP_NAME --allow-root
http-server .
