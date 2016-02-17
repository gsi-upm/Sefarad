FROM python:2.7

RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/gsi-upm/sefarad-3.0.git

WORKDIR sefarad-3.0
EXPOSE 3000
#ENTRYPOINT ["python", "-m", "SimpleHTTPServer"]
WORKDIR /usr/src/app
ENV ENDPOINT elastic.demos.gsi.dit.upm.es
ADD . /usr/src/app
RUN chmod +x runserver.sh
CMD ["./runserver.sh"]
