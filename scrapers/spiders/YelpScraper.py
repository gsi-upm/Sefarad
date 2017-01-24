# -*- coding: utf-8 -*-
import scrapy
import json
import sys
import urlparse
import re


class YelpscraperSpider(scrapy.Spider):
    name = "YelpScraper"
    allowed_domains = ["yelp.com", "yelp.es", "yelp.ca"]
    start_urls = []
    pages = None
    current_page = 1
    extracting_recommended_reviews = True
    keys=None
    filePath=None
    handle_httpstatus_list = [404]

    def __init__(self, url, filePath=None, pages=None, only_not_recommended=False, keys=None):
        self.filePath = filePath
        try:
            if url.find('http') != 0:
                self.returnError(None)
                return
        except Exception as e:
            self.returnError(e)
            return
        self.start_urls = []
        self.pages = None
        self.current_page = 1
        self.extracting_recommended_reviews = True

        self.keys = keys

        if(isinstance(url, list)):
            self.start_urls = url
        else: 
            self.start_urls.append(url)
        if(only_not_recommended):
            self.extracting_recommended_reviews = False
        #print 'Scraping ' + self.start_urls[0]
        if(pages == None):
            self.pages = None
        else:
            self.pages = int(pages)

    def parse(self, response):
        try:
            name = self.encodeUTF8(response.css('h1.biz-page-title::text')[0].extract()).strip()
            #print 'Scrapeando %s' % name
            image = self.encodeUTF8(response.css('div.showcase-photo-box img.photo-box-img::attr(src)')[0].extract()).strip()
            item = {'@context':'http://schema.org', 'name':name, 'image':image, 'reviews':[]}
            if(self.keys != None):
                item['business_id'] = self.keys[response.request.meta['redirect_urls'][0]]
            if(self.extracting_recommended_reviews):
                recommended_reviews = self.parse_reviews_list(response)
                #print 'Scrapeadas %d paginas recomendadas' % (self.current_page)
                item['reviews'] = recommended_reviews
                self.current_page = 1
            else: self.current_page = 0
            nextRequest = self.get_next_request(response)
            if(nextRequest == None):
                #print '############ Scrapeo de %s terminado ############' % item['name']
                self.saveText(json.dumps(item), self.filePath)
                yield item
                return
            nextRequest.meta['item']=item
            yield nextRequest
        except Exception as e:
            self.returnError(e)

    def parse_reviews_list(self, response):
        try:
            reviews_containers = None
            if(self.extracting_recommended_reviews):
                reviews_containers = response.css('ul.reviews > li')
            else:
                reviews_containers = response.css('div.not-recommended-reviews ul.reviews > li')
            return self.parse_reviews(reviews_containers)
        except Exception as e:
            self.returnError(e)

    def parse_reviews(self, reviews_containers):
        reviews = list()
        for review_container in reviews_containers:
            review = None
            if(self.extracting_recommended_reviews):
                review = self.parse_review(review_container)
            else:
                review = self.parse_not_recommended_review(review_container)
            if(review != None):
                reviews.append(review)
        return reviews

    def parse_review(self, review_container):
        try:
            name = self.encodeUTF8(review_container.css('meta[itemprop=author]::attr(content)')[0].extract())
            rating = float(review_container.css('meta[itemprop=ratingValue]::attr(content)')[0].extract())
            date = self.encodeUTF8(review_container.css('meta[itemprop=datePublished]::attr(content)')[0].extract())
            message = review_container.css('p[itemprop=description]')[0].css('::text').extract()
            message = self.encodeUTF8('\n'.join(message))
            review = {'@type':'Review', 'author':{'@type':'Person', 'name':name}, 'ratingValue':rating, 'datePublished':date, 'reviewBody':message}
            return review
        except Exception as e:
            return None

    def parse_not_recommended_review(self, review_container):
        try:
            name = None
            try:
                name = self.encodeUTF8(review_container.css('span.user-display-name::text')[0].extract())
            except:
                name = review_container.css('li.user-name > span::text').extract()
                name = self.encodeUTF8('\n'.join(name))
            rating_class = self.encodeUTF8(review_container.css('i.star-img::attr(class)')[0].extract())
            rating = float(re.search('stars_\d', rating_class).group().replace('stars_',''))
            date = self.encodeUTF8(review_container.css('span.rating-qualifier::text')[0].extract()).strip()
            message = review_container.css('div.review-content p')[0].css('::text').extract()
            message = self.encodeUTF8('\n'.join(message))
            review = {'@type':'Review', 'author':{'@type':'Person', 'name':name}, 'ratingValue':rating, 'datePublished':date, 'reviewBody':message}
            return review
        except Exception as e:
            return None

    def get_next_request(self, response):
        if(self.extracting_recommended_reviews):
            request = self.get_next_page_request(response)
            if(request == None):
                self.extracting_recommended_reviews = False
                self.current_page = 0
                return self.get_next_request(response)
            return request
        else:
            request = None
            if(self.current_page == 0):
                request = self.get_not_recommended_reviews_request(response)
            else:
                request = self.get_next_page_request(response)
            return request


    def get_next_page_request(self, response):
        try:
            if(self.pages != None and self.current_page >= self.pages):
                return None
            pagination_next_link = []
            if(self.extracting_recommended_reviews):
                pagination_next_link = response.css('a.page-option.prev-next.next::attr(href)')
            else:
                pagination_next_link = response.css('div.not-recommended-reviews a.page-option.prev-next.next::attr(href)')
            
            if(len(pagination_next_link) == 0):
                return None

            pagination_next_link = pagination_next_link[0].extract()
            url = urlparse.urljoin(response.url, pagination_next_link)
            return scrapy.Request(url, callback=self.parse_next_page_reviews)
        except Exception as e:
            #print 'a %s' % str(e)
            return None

        return None

    def get_not_recommended_reviews_request(self, response):
        try:
            not_recommended_reviews_url = response.css('div.not-recommended > a::attr(href)')[0].extract()
            not_recommended_reviews_url = urlparse.urljoin(response.url, not_recommended_reviews_url)
            return scrapy.Request(not_recommended_reviews_url, callback=self.parse_next_page_reviews)
        except Exception as e:
            return None


    def parse_next_page_reviews(self, response):
        try:
            item = response.meta['item']
            reviews = self.parse_reviews_list(response)
            item['reviews'] += reviews
            #if(self.extracting_recommended_reviews):
            #    item['reviews'] += reviews
            #else:
            #    item['not_recommended_reviews'] += reviews
            nextRequest = self.get_next_request(response)
            self.current_page = self.current_page + 1
            recommended = 'recomendadas'
            if(self.extracting_recommended_reviews == False): recommended = 'no recomendadas'
            #print '1. Scrapeadas %d paginas %s' % (self.current_page, recommended)
            if(nextRequest == None):
                #print '############ Scrapeo de %s terminado2 ############' % item['name']
                self.saveText(json.dumps(item), self.filePath)
                yield item
                return
            nextRequest.meta['item']=item
            yield nextRequest
        except Exception as e:
            self.returnError(e)

    def saveText(self, text, fileName):
        textutf8 = text.encode('UTF-8')
        text_file = open(fileName, 'w')
        text_file.write(textutf8)
        text_file.close()
        return

    def encodeUTF8(self, string):
        if isinstance(string, unicode):
            return string.encode('utf-8')
        return string

    def returnError(self, error):
        item = {'error':'Crawler has failed to fetch the comments', 'loading':False}
        self.saveText(json.dumps(item), self.filePath)