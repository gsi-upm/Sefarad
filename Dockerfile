FROM node:7.10

RUN npm install -g bower http-server

WORKDIR /usr/src/app

RUN echo '{ "allow_root": true }' > /root/.bowerrc
ADD . /usr/src/app

RUN bower install --allow-root

CMD ["http-server"]
