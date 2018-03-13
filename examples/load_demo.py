from elasticsearch import Elasticsearch
import json

host = "elasticsearch"
es = Elasticsearch(hosts=[{'host': host, 'port': 9200}])
with open('tourpedia_data.json') as infile:
    count = 0
    jsonfile = json.load(infile)
    for tweet in jsonfile:
        count = count + 1
        print(tweet)
        raw_record = tweet
        es.index(index='tourpedia', doc_type='places', id=count, body=raw_record)

with open('ftt_data.json') as infile:
    count = 0
    for line in infile:
        tweet = json.loads(line)
        count = count + 1
        print(tweet)
        raw_record = tweet
        es.index(index='ftten', doc_type='entities', id=count, body=raw_record)