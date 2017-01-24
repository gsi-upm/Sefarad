# -*- coding: utf-8 -*-
import scrapy
import re
import json
import urlparse


class AmazonscraperSpider(scrapy.Spider):
	name = "AmazonScraper"
	allowed_domains = ["amazon.es", "amazon.com"]
	start_urls = []
	url_reviews_format = 'http://www.amazon%s/product-reviews/%s'
	url_base = 'http://www.amazon.es/'
	pages = None
	current_page = 1
	filePath=None
	handle_httpstatus_list = [404]

	def __init__(self, amazon_id, domain, pages=None, filePath=None):
		self.start_urls = [self.url_reviews_format % (domain, amazon_id)]
		self.filePath = filePath
		#print 'Scraping ' + self.start_urls[0]
		if(pages == None):
			self.pages = None
		else: 
			self.pages = int(pages)

	def parse(self, response):
		try:
			name = response.css('div.a-row.product-title a::text')[0].extract()
			name = self.encodeUTF8(name)
			#price = response.css('div.a-row.product-price-line span.a-color-price::text')[0].extract()
			#price = self.encodeUTF8(price)
			image = response.css('a.a-link-normal img::attr(src)')[0].extract()
			image = self.bigImage(self.encodeUTF8(image))
			reviews = self.extract_reviews_list(response)
			item = {'@context':'http://schema.org', 'name':name, 'image':image, 'reviews':reviews}
			self.current_page = 1
			nextRequest = self.get_next_request(response)
			if(nextRequest == None):			
				#print '############ TERMINADO Paginas=%d ############' % self.current_page
				self.saveText(json.dumps(item), self.filePath)
				yield item
				return
			nextRequest.meta['item'] = item
			yield nextRequest
		except Exception as e:
			self.returnError(e)

	def get_next_request(self, response):
		try:
			if(self.pages != None and self.current_page >= self.pages):
				return None
			pagination_div = response.css('#cm_cr-pagination_bar')
			if(len(pagination_div) == 0):
				return None
			pagination_div = pagination_div[0]
			nextPageUrl = pagination_div.css('ul.a-pagination > li.a-last > a::attr(href)')[0].extract()
			url = urlparse.urljoin(response.url, nextPageUrl)
			return scrapy.Request(url, callback=self.parse_reviews_list)
		except:
			return None
		return None

	def parse_reviews_list(self, response):
		reviews = self.extract_reviews_list(response)
		item = response.meta['item']
		for review in reviews:
			item['reviews'].append(review)
		self.current_page = self.current_page + 1
		nextRequest = self.get_next_request(response)
		if(nextRequest == None):
			#print '############ TERMINADO Paginas=%d ############' % self.current_page
			self.saveText(json.dumps(item), self.filePath)
			yield item
			return
		#print 'Scrapeadas %d paginas' % self.current_page
		nextRequest.meta['item'] = item
		yield nextRequest

	def extract_reviews_list(self, response):
		try:
			reviews = list()
			reviews_list_container = response.css('#cm_cr-review_list')
			reviews_list = reviews_list_container.css('div.a-section.review')
			for review_code in reviews_list:
				review = self.parse_review_code(review_code)
				if(review != None):
					reviews.append(review)
			return reviews
		except Exception as e:
			self.returnError(e)


	def parse_review_code(self, review_code):
		try:
			rating_class = review_code.css('div.a-row i.a-icon.a-icon-star.review-rating::attr(class)')[0].extract()
			rating_class = self.encodeUTF8(rating_class)
			rating = float(re.search('a-star-(.*) ', rating_class).group(1).replace('-', '.'))
			author = review_code.css('div.a-row a.author::text')[0].extract()
			author = self.encodeUTF8(author)
			date = review_code.css('div.a-row span.review-date::text')[0].extract()
			date = self.encodeUTF8(date)
			message = review_code.css('div.a-row.review-data span.review-text::text')[0].extract()
			message = self.encodeUTF8(message)
			return {'@type':'Review', 'ratingValue':rating, 'author':{'@type':'Person', 'name':author}, 'datePublished':date, 'reviewBody':message}
		except:
			return None

	def encodeUTF8(self, string):
		if isinstance(string, unicode):
			return string.encode('utf-8')
		return string

	def bigImage(self, url_image):
		numberPoint = 0
		index1 = 0
		index2 = 0
		for i in range(len(url_image)):
			i = len(url_image) - i - 1
			if(url_image[i] == '/'): return url_image
			if(url_image[i] == '.'):
				if(numberPoint == 0): 
					numberPoint += 1
					index1 = i
				else:
					return url_image[0:i] + url_image[index1:]


	def saveText(self, text, fileName):
		textutf8 = text.encode('UTF-8')
		text_file = open(fileName, "w")
		text_file.write(textutf8)
		text_file.close()
		return

	def returnError(self, error):
		print str(error)
		item = {'error':'Crawler has failed to fetch the comments', 'loading':False}
		self.saveText(json.dumps(item), self.filePath)