from node:7.10.0

ENV NODE_PATH=/tmp/node_modules APP_NAME=sefarad

# Install dependencies first to use cache
RUN npm install -g http-server bower

ADD bower.json /usr/src/bower.json

RUN cd /usr/src && \
    bower install --allow-root 

RUN cp -r /usr/src/bower_components/ /usr/src/app/ 

ADD . /usr/src/app

WORKDIR /usr/src/app/

CMD ["http-server"]
