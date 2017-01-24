import os
import re

def startScraping(tripadvisor_url, resultPath):
	scriptPath = os.getcwd()+'/scrapers/spiders/tripadvisor.py'
	params = '"%s" %s' % (tripadvisor_url, resultPath)
	os.system('python %s %s' % (scriptPath, params))