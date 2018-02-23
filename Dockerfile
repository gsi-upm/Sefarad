from node:7.10.0

ENV NODE_PATH=/tmp/node_modules APP_NAME=sefarad

# Install dependencies first to use cache
RUN npm install -g http-server bower

WORKDIR /usr/src/app/

RUN mkdir -p /etc/ssl/certs
COPY lab.cluster.gsi.dit.upm.es.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

ADD bower.json /usr/src/bower.json

ADD . /usr/src/app

RUN cd /usr/src && \
    bower install --allow-root 

CMD ["/usr/src/app/init.sh"]
