FROM python:2.7

RUN mkdir -p /usr/src/sefarad
WORKDIR /usr/src/sefarad
ADD requirements.txt /usr/src/sefarad/
RUN pip install -r requirements.txt

ADD . /usr/src/sefarad
COPY ./httpd.conf /conf

ENTRYPOINT ["python", "launch.py"]