# -*- coding: utf-8 -*-
#
# Copyright 2012-2015 Spotify AB
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import datetime
import json
import random
import tweepy
import os
import requests
from rdflib import Graph, plugin
from rdflib.serializer import Serializer
import sched, time 
import luigi
from luigi.contrib.esindex import CopyToIndex

class FetchDataTask(luigi.Task):
    """
    Generates a local file containing 5 elements of data in JSON format.
    """

    #: the date parameter.

    #date = luigi.DateParameter(default=datetime.date.today())
    #field = str(random.randint(0,10000)) + datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    searchquery = luigi.Parameter()


    def run(self):
        """
        Writes data in JSON format into the task's output target.
        The data objects have the following attributes:
        * `_id` is the default Elasticsearch id field,
        * `text`: the text,
        * `date`: the day when the data was created.
        """
        
        #today = datetime.date.today()
        consumer_key = os.environ.get('CONSUMER_KEY')
        consumer_secret = os.environ.get('CONSUMER_SECRET')
        access_token = os.environ.get('ACCESS_TOKEN')
        access_token_secret = os.environ.get('ACCESS_TOKEN_SECRET')

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)

        api = tweepy.API(auth)

        max_tweets = 1000
        query = self.searchquery

        searched_tweets = []
        last_id = -1
        while len(searched_tweets) < max_tweets:
            count = max_tweets - len(searched_tweets)
            try:
                new_tweets = api.search(q=query, count=count, max_id=str(last_id - 1))
                if not new_tweets:
                    break
                searched_tweets.extend(new_tweets)
                last_id = new_tweets[-1].id
            except tweepy.TweepError as e:
                # depending on TweepError.code, one may want to retry or wait
                # to keep things simple, we will give up on an error
                break
        with self.output().open('w') as output:
            for item in searched_tweets:
                jsontweet = json.dumps(item._json)
                tweet = json.loads(jsontweet)
                mytweet = {}
                #print(tweet)
                mytweet["_id"] = tweet["id"]
                mytweet["id"] = tweet["id"]
                mytweet["text"] = tweet["text"]
                mytweet["user"] = tweet["user"]
                mytweet["created_at"] = tweet["created_at"]
                json.dump(mytweet, output)
                output.write('\n')

    def output(self):
        """
        Returns the target output for this task.
        In this case, a successful execution of this task will create a file on the local filesystem.
        :return: the target output for this task.
        :rtype: object (:py:class:`luigi.target.Target`)
        """
        return luigi.LocalTarget(path='/tmp/_docs-%s.json' % datetime.date.today())


class SenpyTask(luigi.Task):
    """
    This task loads data fetched with previous task and send it to Senpy tool in order to analyze 
    data retrieved and check sentiments expressed.
    """
    #: date task parameter (default = today)
    #date = luigi.DateParameter(default=datetime.date.today())
    searchquery = luigi.Parameter()
    #file = str(random.randint(0,10000)) + datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")


    def requires(self):
        """
        This task's dependencies:
        * :py:class:`~.FetchDataTask`
        :return: object (:py:class:`luigi.task.Task`)
        """
        return FetchDataTask(self.searchquery)

    def output(self):
        """
        Returns the target output for this task.
            In this case, a successful execution of this task will create a file on the local filesystem.
            :return: the target output for this task.
            :rtype: object (:py:class:`luigi.target.Target`)
        """
        return luigi.LocalTarget(path='/tmp/analyzed-%s.jsonld' % datetime.date.today())    


    def run(self):
        """
        Send data to Senpy tool and retrieve it analyzed. Store data in a json file.
        """
        with self.output().open('w') as output:
            with self.input().open('r') as infile:
                for line in infile:
                    i = json.loads(line)
                    r = requests.get('http://test.senpy.cluster.gsi.dit.upm.es/api/?algo=sentiment-tass&i=%s' % i["text"])
                    response = r.content.decode('utf-8')
                    response_json = json.loads(response)
                    i["_id"] = i["id"]
                    #i["analysis"] = response_json
                    i["sentiment"] = response_json["entries"][0]["sentiments"][0]["marl:hasPolarity"]   
                    i["polarity"] = response_json["entries"][0]["sentiments"][0]["marl:polarityValue"]   
                    output.write(json.dumps(i))
                    #print(i)
                    output.write('\n')


class Elasticsearch(CopyToIndex):
    """
    This task loads JSON data contained in a :py:class:`luigi.target.Target` into an ElasticSearch index.
    This task's input will the target returned by :py:meth:`~.Senpy.output`.
    This class uses :py:meth:`luigi.contrib.esindex.CopyToIndex.run`.
    After running this task you can run:
    .. code-block:: console
        $ curl "localhost:9200/example_index/_search?pretty"
    to see the indexed documents.
    To see the update log, run
    .. code-block:: console
        $ curl "localhost:9200/update_log/_search?q=target_index:example_index&pretty"
    To cleanup both indexes run:
    .. code-block:: console
        $ curl -XDELETE "localhost:9200/example_index"
        $ curl -XDELETE "localhost:9200/update_log/_query?q=target_index:example_index"
    """
    #: date task parameter (default = today)
    date = luigi.DateParameter(default=datetime.date.today())

    searchquery = luigi.Parameter()

    #: the name of the index in ElasticSearch to be updated.
    index = luigi.Parameter()
    #: the name of the document type.
    doctype = luigi.Parameter()
    #: the host running the ElasticSearch service.
    host = 'elasticsearch'
    #: the port used by the ElasticSearch service.
    port = 9200
    
    def requires(self):
        """
        This task's dependencies:
        * :py:class:`~.SenpyTask`
        :return: object (:py:class:`luigi.task.Task`)
        """
        return SenpyTask(self.searchquery)


if __name__ == "__main__":
    #luigi.run(['--task', 'Elasticsearch'])
    #luigi.run()
    '''
    s = sched.scheduler(time.time, time.sleep)
    def runevery():
        luigi.run()
        s.enter(60, 1, runevery)
    s.enter(60, 1, runevery)
    s.run()
    '''