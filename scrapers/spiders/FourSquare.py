# -*- coding: utf-8 -*-
import scrapy
import json
import urlparse
import traceback

class FourSquareSpider(scrapy.Spider):
	name = "FourSquareScraper"
	allowed_domains = ["foursquare.es", "foursquare.com"]
	start_urls = []
	pages = None
	current_page = 1
	filePath=None
	handle_httpstatus_list = [404]

	def __init__(self, url, pages=None, filePath=None):
		self.start_urls = [url]
		self.filePath = filePath
		if(pages == None):
			self.pages = None
		else: 
			self.pages = int(pages)

	def parse(self, response):
		try:
			name = response.css('h1.venueName::text')[0].extract()
			name = self.encodeUTF8(name)
			image = response.css('#container > div > div.photoBanner img::attr(src)')[0].extract()
			image = self.encodeUTF8(image)
			reviews = self.extract_reviews_list(response)
			item = {'@context':'http://schema.org', 'name':name, 'image':image, 'reviews':reviews}
			self.current_page = 1
			nextRequest = self.get_next_request(response)
			if(nextRequest == None):
				self.saveJSON(json.dumps(item), self.filePath)
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
			pagination_div = response.css('#tipsContainer > div.tipPagination')
			if(len(pagination_div) == 0):
				return None
			pagination_div = pagination_div[0]
			number_of_pages = pagination_div.css('a')
			if(len(number_of_pages) <= self.current_page):
				return None
			self.current_page = self.current_page + 1
			url = '%s?tipsPage=%s' % (self.start_urls[0], self.current_page)
			print url
			return scrapy.Request(url, callback=self.parse_reviews_list)
		except Exception as e:
			print str(e)
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
			self.saveJSON(json.dumps(item), self.filePath)
			yield item
			return
		nextRequest.meta['item'] = item
		yield nextRequest

	def extract_reviews_list(self, response):
		try:
			reviews = list()
			reviews_list_container = response.css('#tipsList')[0]
			reviews_list = reviews_list_container.css('li')
			for review_code in reviews_list:
				review = self.parse_review_code(review_code)
				if(review != None):
					reviews.append(review)
			return reviews
		except Exception as e:
			self.returnError(e)

	def parse_review_code(self, review_code):
		try:
			author = review_code.css('span.userName > a::text')[0].extract()
			author = self.encodeUTF8(author)
			date = review_code.css('span.tipDate::text')[0].extract()
			date = self.encodeUTF8(date)
			message = review_code.css('div.tipText::text')[0].extract()
			message = self.encodeUTF8(message)
			return {'@type':'Review', 'author':{'name':author, '@type':'Person'}, 'datePublished':date, 'reviewBody':message}
		except:
			traceback.print_exc()
			return None

	def encodeUTF8(self, string):
		if isinstance(string, unicode):
			return string.encode('utf-8')
		return string

	def saveJSON(self, json, fileName):
		textutf8 = json.encode('UTF-8')
		text_file = open(fileName, "w")
		text_file.write(textutf8)
		text_file.close()
		return

	def returnError(self, error):
		print '###### ' + str(error)
		traceback.print_exc()
		item = {'error':'Crawler has failed to fetch the comments', 'loading':False}
		self.saveJSON(json.dumps(item), self.filePath)