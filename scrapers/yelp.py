import os

def startScraping(url, resultPath):
	scriptPath = './scrapers/spiders/YelpScraper.py'
	params = '-a url="%s" -a filePath="%s" --nolog' % (url, resultPath)
	command = 'scrapy runspider %s %s' %(scriptPath, params)
	os.system(command)
	print 'Finished scraping YELP'	
