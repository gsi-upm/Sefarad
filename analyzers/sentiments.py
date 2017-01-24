import os
import json
import urllib


#base_url = 'http://127.0.0.1:5000/?algo=sentiment140&i=%s'
base_url = 'http://senpy.cluster.gsi.dit.upm.es/api/?algo=sentiText&lang=es&i=%s'

def analyze(scraped_reviews, resultPath):
	try:
		global base_url
		reviews = scraped_reviews['reviews']
		for review in reviews:
			url = base_url % urllib.quote_plus(review['reviewBody'].encode('utf8'))
			response = urllib.urlopen(url.decode('utf8'))
			print url
			data = json.loads(response.read())
			print data
			review['sentimentAnalysis'] = data

		analysis_result = scraped_reviews
		analysis_result['loading'] = False
		analysis_result['error'] = None
		analysis_result['containsSentimentsAnalysis'] = True
	except Exception as e:
		print str(e)
		analysis_result = {"error":"An error ocurred while analyzing: %s" %str(e), "loading":False}

	with open(resultPath, 'w') as file:
		file.write(json.dumps(analysis_result))
