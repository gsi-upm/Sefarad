import luigi
from luigi import configuration
from luigi.s3 import S3Target, S3PathTask
import threading
from time import sleep
import os
import json
import imp
import random
import datetime

import uuid
from bottle import route, run, template, static_file, response, request, install

import luigi
import urllib2

pending_analysis = {}
ids = {}

def return_json(result):
		return json.dumps(result)


class ScrapUrlTask(luigi.Task):
    	#http://www.yelp.com/biz/taqueria-cazadores-san-francisco-2
	url = luigi.Parameter(default="https://es.foursquare.com/v/cafeter%C3%ADa-hd/4b5b0ca9f964a520d0e028e3")
	unique_id = str(uuid.uuid1())
	webpage = luigi.Parameter(default="foursquare")
	analysis_type = luigi.Parameter(default="sentiments")
	 
    	def output(self):
       		return luigi.LocalTarget(path='analysis/%s.scraper' % self.unique_id)

	def run(self):
		#content = urllib2.urlopen(self.url).read()
		#print content
		#scrap_url('yelp','sentiments',self.url)

		rv = {'error':None,  'loading':True, 'uuid':self.unique_id,
			  'analysis_type' : self.analysis_type,
			  'webpage':self.webpage, 'scraping':True}
		pending_analysis[self.unique_id] = rv
		ids[0] = self.unique_id
		
		
		#Start scraper
		
		try:
			filePath = 'analysis/%s.scraper' % self.unique_id
			print "######## filePath: ",filePath


			scraperImported = imp.load_source(self.webpage, 'scrapers/%s.py' % (self.webpage))
			#scraperImported.startScraping, args=(self.url, filePath)

			scraperTask = threading.Thread(target=scraperImported.startScraping, args=(self.url, filePath))
			scraperTask.start()
			scraperTask.join()

			
			with open(filePath) as result:
				with self.output().open('w') as output:
					json.dump(result, output)
					print output
			
	
				
		except Exception as e:
			return {'error':'%s scraper doesn\'t exist' % (self.webpage), 'loading':False}

class SenpyAnalysisTask(luigi.Task):
	unique_id = str(uuid.uuid1())

	def requires(self):
		return ScrapUrlTask()

	def run(self):
		print "Analisis"
		#filePath = imp.load_source(ids[0], './analysis/%s.scraper' % (ids[0]))
		'''
		with self.input().open('r') as analysis_file:
			scraped_reviews = json.loads(analysis_file.read())
			analysis_types = {'sentiments'}
			analysis_type = analysis_types[0]
			self.startAnalysis(scraped_reviews,'sentiments',unique_id)
			try:
				resultPath = '%s/analysis/%s.analisis' % (os.getcwd(), self.unique_id)
				importedAnalyzer = imp.load_source(analysis_types[0], '%s/analyzers/%s.py' % (os.getcwd(), analysis_types[0]))
				analysisTask = threading.Thread(target=importedAnalyzer.analyze, args=(scraped_reviews, resultPath))
				analysisTask.start()		
				analysisTask.join()	
	
			except Exception as e:
				print '###### startAnalysis ' + str(e)
				return {'error':'%s analyzer doesn\'t exist' %(analysis_types[0]), 'loading':False}

		with open(resultPath) as result:
				with self.output().open('w') as output:
					json.dump(result, output)
	
		'''
#GSI CRAWLER functions

def return_json(result):
	return json.dumps(result)

def startScraper(webpage, url, unique_id):
	try:
		filePath = './analysis/%s.scraper' % (unique_id)
		print "filePath: ",filePath
		scraperImported = imp.load_source(webpage, './scrapers/%s.py' % (webpage))
		scraperTask = threading.Thread(target=scraperImported.startScraping, args=(url, filePath))
		scraperTask.start()
	except Exception as e:
		return {'error':'%s scraper doesn\'t exist' % (webpage), 'loading':False}

def scrap_url(nameWeb,analysisType, url):
	#global scraping
	webpage = nameWeb
	analysis_type = analysisType
	unique_id = str(uuid.uuid1())
	#unique_id = 'test'
	rv = {'error':None,  'loading':True, 'uuid':unique_id,
		  'analysis_type' : analysis_type,
		  'webpage':webpage, 'scraping':True}
	pending_analysis[unique_id] = rv
	startScraper(webpage, url, unique_id)
	return return_json(rv)


	def retrieve_info(self):
			print "######Inside retrieve_info"
			global pending_analysis
			unique_id = 'test'
			try:
				analysis_info = pending_analysis[unique_id]
				if(analysis_info['scraping']):
					return self.checkScrapedFinishedAndStartAnalysis(self,analysis_info, unique_id)
				#else:
					#return checkAnalysisFinished(analysis_info, unique_id)
			except Exception as e:
				print '#### retrieve_info ' + str(e)
				return return_json({'error':'No valid uuid', 'loading':False, 'uuid':unique_id})

	def checkScrapedFinishedAndStartAnalysis(self,analysis_info, unique_id):
		try:
			print "######Inside checkScrapedFinishedAndStartAnalysis"
			with open('analysis/%s.scraper'%unique_id, 'r') as analysis_file:
				scraped_reviews = json.loads(analysis_file.read())
				if('error' in scraped_reviews and scraped_reviews['error'] != None):
					return return_json(scraped_reviews)
				analysis_info['scraping'] = False
				analysis_types = analysis_info['analysis_type'].split(",")
				error = self.startAnalysis(scraped_reviews, analysis_types[0], unique_id)
				del analysis_types[0]
				analysis_info['analysis_type'] = ','.join(analysis_types)
				if(error):
					return return_json(error)
				print "Analisis :",return_json(analysis_info)
				return return_json(analysis_info)
		except Exception as e:
			print '######  checkScrapedFinishedAndStartAnalysis' + str(e)
			return return_json(analysis_info)
	def startAnalysis(self,scraped_reviews, analysis_type, unique_id):
		try:
			resultPath = '%s/analysis/%s.analisis' % (os.getcwd(), unique_id)
			importedAnalyzer = imp.load_source(analysis_type, '%s/analyzers/%s.py' % (os.getcwd(), analysis_type))
			analysisTask = threading.Thread(target=importedAnalyzer.analyze, args=(scraped_reviews, resultPath))
			analysisTask.start()
			return None
		except Exception as e:
			print '###### startAnalysis ' + str(e)
			return {'error':'%s analyzer doesn\'t exist' %(analysis_type), 'loading':False}

	def run(self):
		print "Analisis"
		unique_id='test'
		with open('analysis/%s.scraper'%unique_id, 'r') as analysis_file:
			scraped_reviews = json.loads(analysis_file.read())
			analysis_types = {'sentiments'}
		
		self.startAnalysis(scraped_reviews,'sentiments',unique_id)
		with open('analysis/%s.analisis' % unique_id) as analysis_file:
			analysis_result = json.loads(analysis_file.read())
			print return_json(analysis_result)


class SemanticTask(luigi.Task):
     """
     This task loads JSON data contained in a :py:class:`luigi.target.Target` and transform into RDF file
     to insert into Fuseki platform as a semantic 
     """
     #: date task parameter (default = today)
     date = luigi.DateParameter(default=datetime.date.today())
     file = str(random.randint(0,10000)) + datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

     def output(self):
	"""
        Returns the target output for this task.
        In this case, a successful execution of this task will create a file on the local filesystem.
        :return: the target output for this task.
        :rtype: object (:py:class:`luigi.target.Target`)
        """
        return luigi.LocalTarget(path='analysis/%s.n3' % self.file)


     def requires(self):
        """
        This task's dependencies:
        * :py:class:`~.SenpyTask` 
        :return: object (:py:class:`luigi.task.Task`)
        """
        return SenpyAnalysisTask()

     def run(self):
	"""
	Receive data from Senpy and transform them to RDF format in order to be indexed in Fuseki
	"""
	with self.input().open('r') as infile:
		j = json.load(infile)
		g = Graph().parse(data=j, format='json-ld')
	with self.output().open('w') as output:
                output.write(g.serialize(format='n3', indent=4))
    
	
                 
if __name__ == '__main__':
    luigi.run()
