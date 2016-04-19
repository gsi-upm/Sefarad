FROM rgoyard/apache-proxy

EXPOSE 80


COPY . /app
COPY ./httpd.conf /conf
#WORKDIR /app
#ENV ENDPOINT sefarad.demos.gsi.dit.upm.es
#RUN chmod +x runserver.sh
#RUN ./runserver.sh
