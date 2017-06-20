FROM python:3

RUN apt-get update && apt-get install -y gettext

RUN pip install luigi elasticsearch rdflib requests sqlalchemy tweepy

WORKDIR /usr/src/app

ADD . /usr/src/app

ADD run-cron.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/run-cron.sh

CMD ["sh","/usr/local/bin/run-cron.sh"]