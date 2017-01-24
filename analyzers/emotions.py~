import os
import json
import urllib

#base_url = 'http://127.0.0.1:5000/?algo=EmoText&i=%s'
#base_url= 'http://senpy.cluster.gsi.dit.upm.es/api/?algo=EmoTextANEW&lang=es&i=%s'
base_url= 'http://senpy.cluster.gsi.dit.upm.es/api/?algo=EmoText&i=%s'

def analyze(scraped_reviews, resultPath):
	try:
		global base_url
		reviews = scraped_reviews['reviews']
		for review in reviews:
			url = base_url % urllib.quote_plus(review['reviewBody'].encode('utf8'))
			response = urllib.urlopen(url.decode('utf8'))
			data = json.loads(response.read())
			review['emotionAnalysis'] = data

		analysis_result = scraped_reviews
		analysis_result['loading'] = False
		analysis_result['error'] = None
		analysis_result['containsEmotionsAnalysis'] = True
	except Exception as e:
		print str(e)
		analysis_result = {"error":"An error ocurred while analyzing: %s" %str(e), "loading":False}

	with open(resultPath, 'w') as file:
		file.write(json.dumps(analysis_result))
