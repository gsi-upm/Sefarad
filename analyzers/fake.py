import os
import json
import random

fakePercentage = None

def isFake(message):
	global fakePercentage
	if(fakePercentage == None):
		fakePercentage = random.uniform(1, 30)
	return random.random()*100 < fakePercentage

def analyze(scraped_reviews, resultPath):
	try:
		for review in scraped_reviews['reviews']:
			if isFake(review['reviewBody']):
				review['fakeAnalysis'] = {"fake":True}
			else: review['fakeAnalysis'] = {"fake":False}
		analysis_result = scraped_reviews
		analysis_result['loading'] = False
		analysis_result['error'] = None
		analysis_result['containsFakeAnalysis'] = True
	except Exception as e:
		print str(e)
		analysis_result = {"error":"An error ocurred while analyzing: %s" % str(e), "loading":False}

	with open(resultPath, 'w') as file:
		file.write(json.dumps(analysis_result))
