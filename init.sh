#!/bin/sh

# Copy bower dependencies when using -v $PWD/:/usr/src/app
if [ -f /.dockerenv ]; then
    cp -a /usr/src/bower_components /usr/src/app/;
    mkdir -p /usr/src/app/demos/ftt/ /usr/src/app/demos/tourpedia/ /usr/src/app/demos/aspects/
    cp -a /usr/src/bower_components/dashboard-ftt/index.html /usr/src/app/demos/ftt/
    cp -a /usr/src/bower_components/dashboard-tourpedia/index.html /usr/src/app/demos/tourpedia/
    cp -a /usr/src/bower_components/dashboard-aspects/index.html /usr/src/app/demos/aspects/
fi

bower link --allow-root
bower link $APP_NAME --allow-root
http-server .
