import os
import re

def extractAmazonId(url):
	m = re.search("\/product\/.*\/", url)
	try:
		if m:
			str = m.group(0)
			return str.split('/')[2]
	except:
		pass
	m = re.search("\/dp\/.*\/", url)
	try:
		if m:
			str = m.group(0)
			return str.split('/')[2]
	except:
		pass
	return url

def extractDomain(url):
	try:
		url.index("amazon.com")
		return ".com"
	except:
		return ".es"

def startScraping(amazon_id, resultPath):
	scriptPath = os.getcwd()+'/scrapers/spiders/AmazonScraper.py'
	amazon_id = '%s/' % amazon_id
	domain = extractDomain(amazon_id)
	amazon_id = extractAmazonId(amazon_id)
	params = '-a domain="%s" -a amazon_id="%s" -a filePath="%s" --nolog' % (domain, amazon_id, resultPath)
	os.system('scrapy runspider %s %s' %(scriptPath, params))