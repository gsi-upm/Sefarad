FROM python:3

RUN pip install luigi elasticsearch rdflib requests

WORKDIR /usr/src/app

ADD . /usr/src/app

ENTRYPOINT ["python","-m","luigi"]
