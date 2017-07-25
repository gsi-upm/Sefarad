import threading
from time import sleep
import os
import json
import imp
import rdflib

import uuid
from bottle import route, run, template, static_file, response, request, install, default_app
from elasticsearch import Elasticsearch
from datetime import datetime
import requests
from rdflib import Graph

pending_analysis = {}
es = Elasticsearch()

def return_json(result):
	response.content_type = 'application/json'
	return json.dumps(result)


def startScraper(webpage, url, unique_id):
	try:
		filePath = '%s/analysis/%s.scraper' % (os.getcwd(), unique_id)
		scraperImported = imp.load_source(webpage, '%s/scrapers/%s.py' % (os.getcwd(), webpage))
		scraperTask = threading.Thread(target=scraperImported.startScraping, args=(url, filePath))
		scraperTask.start()
	except Exception as e:
		return {'error':'%s scraper doesn\'t exist' % (webpage), 'loading':False}

def startAnalysis(scraped_reviews, analysis_type, unique_id):
	try:
		resultPath = '%s/analysis/%s.analisis' % (os.getcwd(), unique_id)
		importedAnalyzer = imp.load_source(analysis_type, '%s/analyzers/%s.py' % (os.getcwd(), analysis_type))
		analysisTask = threading.Thread(target=importedAnalyzer.analyze, args=(scraped_reviews, resultPath))
		analysisTask.start()
		return None
	except Exception as e:
		print '###### startAnalysis ' + str(e)
		return {'error':'%s analyzer doesn\'t exist' %(analysis_type), 'loading':False}

def checkScrapedFinishedAndStartAnalysis(analysis_info, unique_id):
	try:
		with open('analysis/%s.scraper'%unique_id, 'r') as analysis_file:
			scraped_reviews = json.loads(analysis_file.read())
			if('error' in scraped_reviews and scraped_reviews['error'] != None):
				return return_json(scraped_reviews)
			analysis_info['scraping'] = False
			analysis_types = analysis_info['analysis_type'].split(",")
			error = startAnalysis(scraped_reviews, analysis_types[0], unique_id)
			del analysis_types[0]
			analysis_info['analysis_type'] = ','.join(analysis_types)
			if(error):
				return return_json(error)
			return return_json(analysis_info)
	except Exception as e:
		print '######  checkScrapedFinishedAndStartAnalysis' + str(e)
		return return_json(analysis_info)

def checkAnalysisFinished(analysis_info, unique_id,webpage,analysis_type):
	print '#####' +analysis_info['analysis_type']
	if(analysis_info['analysis_type'] == ''):
		try:
			analysis_result = None
			with open('analysis/%s.analisis' % unique_id) as analysis_file:
				analysis_result = json.loads(analysis_file.read())
			#os.remove('analysis/%s.analisis' % unique_id)
			#os.remove('analysis/%s.scraper' % unique_id)
			
			elasticSearchTask = threading.Thread(target=saveInElasticSearch, args=(analysis_result,webpage,analysis_type))
			elasticSearchTask.start()

			convertToN3Task = threading.Thread(target=convertToN3, args=(analysis_result,unique_id))
			convertToN3Task.start()

			return return_json(analysis_result)
		except Exception as e:
			return return_json(analysis_info)
	else:
		analysis_types = analysis_info['analysis_type'].split(",")
		try:
			analysis_result = None
			with open('analysis/%s.analisis' % unique_id) as analysis_file:
				analysis_result = json.loads(analysis_file.read())
			if(analysis_result != None):
				os.remove('analysis/%s.analisis' % unique_id)
				startAnalysis(analysis_result, analysis_types[0], unique_id)
				del analysis_types[0]
				analysis_info['analysis_type'] = ','.join(analysis_types)
				return return_json(analysis_info)
		except Exception as e:
			print 'error analysis'
			return return_json(analysis_info)

@route('/')
def index():
	return static_file('index.html', root='')

def saveInElasticSearch(analysis_result,webpage,analysis_type):
	print '#####ElasticSearch' 
	res = es.index(index=webpage, doc_type=analysis_type, id=1, body=analysis_result)
	print '#####Saved' 

def convertToN3(analysis_result,unique_id):
	print '#####ConvertToN3' 
	value = json.dumps(analysis_result)
	g = Graph().parse(data=value, format='json-ld')
	with open('analysis/%s.n3' % unique_id,'w') as output:
                output.write(g.serialize(format='n3', indent=4))

	print '#####Done' 

@route('/scrap_url')
def scrap_url():
	global scraping
	url = request.query['url']
	webpage = request.query['webpage']
	analysis_type = request.query['analysis_type']
	unique_id = str(uuid.uuid1())
	rv = {'error':None,  'loading':True, 'uuid':unique_id,
		  'analysis_type' : analysis_type,
		  'webpage':webpage, 'scraping':True}
	pending_analysis[unique_id] = rv
	startScraper(webpage, url, unique_id)
	return return_json(rv)

@route('/retrieve_info')
def retrieve_info():
	global pending_analysis, count
	unique_id = request.query['uuid']
	analysis_type = request.query['analysis_type']
	webpage = request.query['webpage']

	try:
		analysis_info = pending_analysis[unique_id]
		if(analysis_info['scraping']):
			return checkScrapedFinishedAndStartAnalysis(analysis_info, unique_id)
		else:
			print '##### checking analysis finished' 
			return checkAnalysisFinished(analysis_info, unique_id,webpage,analysis_type)
	except Exception as e:
		print '#### retrieve_info ' + str(e)
		return return_json({'error':'No valid uuid', 'loading':False, 'uuid':unique_id})

@route('<filepath:path>')
def server_static(filepath):
	return static_file(filepath, root='')

@route('/dbpedia')
def dbpedia():
	return static_file('/dashboards/dbpedia.html', root='')

@route('/absa')
def absa():
	return static_file('/dashboards/absa.html', root='')

@route('/dashftt')
def dashftt():
	return static_file('/dashboards/dashftt.html', root='')

@route('/footballmood')
def footballmood():
	return static_file('/dashboards/footballmood.html', root='')

@route('/gsicrawler')
def gsicrawler():
	return static_file('/dashboards/gsicrawler.html', root='')

@route('/tourpedia')
def tourpedia():
	return static_file('/dashboards/tourpedia.html', root='')

@route('/footballnews')
def tourpedia():
	return static_file('/dashboards/footballnews.html', root='')

application = default_app()

#run(reloader=True)
if __name__ == '__main__':
    run(host='0.0.0.0', port=8080, debug=True)
