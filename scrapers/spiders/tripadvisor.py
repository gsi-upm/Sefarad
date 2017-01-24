#!/usr/bin/env python
#encoding: utf-8


import os
import json
import sys
from parse import *
import re
import time

from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.phantomjs.service import Service as PhantomJSService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from robot_library import seeScreenAndHtml
from robot_library import error
from robot_library import saveText
from robot_library import printDH

'''from Item import Item
from Item import Department
from Item import Category'''

from time import sleep

driver = None
start_url = None
max_page = 10
resultPath = None
current_page = 1

way_of_use = 'La forma de usar el comando es:\npython tripadvisor \"[URL]\" [MAX_PAGE]'

class NoImages(PhantomJSService):
    def __init__(self, *args, **kwargs):
        service_args = kwargs.setdefault('service_args', [])
        service_args += [
            '--load-images=no'
        ]
        super(NoImages, self).__init__(*args, **kwargs)

def bad_command_use(message=None):
	if(message != None):
		print message
	print way_of_use
	sys.exit()

def check_if_valid_url(url):
	return True

def returnError(error=None):
	global resultPath
	item = {'error':'Crawler has failed to fetch the comments', 'loading':False}
	saveText(json.dumps(item), resultPath)

def checkParams():
	global start_url, max_page, resultPath
	if(len(sys.argv) <= 1):
		bad_command_use()
	elif len(sys.argv) == 2:
		if(check_if_valid_url(sys.argv[1])):
			start_url = sys.argv[1]
		else:
			bad_command_use('%s no es una dirección URL válida.' % sys.argv[1])
			returnError()
	elif len(sys.argv) == 3:
		if(check_if_valid_url(sys.argv[1])):
			start_url = sys.argv[1]
		else:
			bad_command_use('%s no es una dirección URL válida.' % sys.argv[1])
			returnError()
		resultPath = sys.argv[2]
	elif len(sys.argv) == 4:
		if(check_if_valid_url(sys.argv[1])):
			start_url = sys.argv[1]
		else:
			bad_command_use('%s no es una dirección URL válida.' % sys.argv[1])
			returnError()
		resultPath = sys.argv[2]
		if(re.match('^[0-9]+$', sys.argv[3]) == None):
			bad_command_use('%s no es un número entero válido.' % sys.argv[3])
			returnError()
		else:
			max_page = int(sys.argv[3])


def init():
	checkParams()
	global driver
	user_agent = (
    	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) " +
    	"AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36"
	)
	dcap = dict(DesiredCapabilities.PHANTOMJS)
	dcap["phantomjs.page.settings.userAgent"] = user_agent
	service_args = ['--load-images=no']
	driver = webdriver.PhantomJS(desired_capabilities=dcap, 
		service_log_path=os.path.devnull, service_args=service_args,
		executable_path='phantomjs')
	'''driver = webdriver.Firefox()'''

def start():
	try:
		global start_url, current_page, resultPath
		init()
		printDH('Iniciando la app...')
		driver.get(start_url)
		name = driver.find_element_by_css_selector('#HEADING').text.encode('UTF-8')
		image = None
		try:
			image = driver.find_element_by_css_selector('#HERO_PHOTO')
			image = image.get_attribute('src')
		except:
			try:
				image = driver.find_element_by_css_selector('#BIG_PHOTO_CAROUSEL img')
				image = image.get_attribute('src')
			except:
				image = "https://watermarkherveybay.files.wordpress.com/2015/08/tripadvisor-logo-nw1.jpg?w=620&h=350"
		printDH('Extrayendo las opiniones de %s' % name)
		printDH('Leyendo la página %d de %d' % (current_page, max_page))
		reviews = parse_reviews_list()
		while(if_next_page_exists_go()):
			current_page+=1
			printDH('Leyendo la página %d de %d' % (current_page, max_page) )
			reviews = reviews + parse_reviews_list()
		result = {'@context':'http://schema.org', 'name':name, 'image':image, 'reviews':reviews}
		saveText(json.dumps(result), resultPath)
		#print json.dumps(result)
	except Exception as e:
		print str(e)
		returnError()


def parse_reviews_list():
	reviews = []
	try_to_expand_reviews_if_needed()
	reviews_containers = driver.find_elements_by_css_selector('[id^=review_]')
	for review_container in reviews_containers:
		review_id = review_container.get_attribute('id')
		if(re.match('^review_\d+$', review_id) == None):
			continue
		full_reviews = review_container.find_elements_by_css_selector('div.dyn_full_review')
		review = None
		if(len(full_reviews) > 0):
			review = parse_review(review_id, full_reviews[0])
		else: review = parse_review(review_id, review_container)
		if(review != None):
			reviews.append(review)
		else: print 'hubo un error en %s' % review_id
	return reviews

def parse_review(review_id, review_container):
	date = review_container.find_element_by_css_selector('span.ratingDate').text
	rating_class = review_container.find_element_by_css_selector('span.rate img').get_attribute('class')
	rating = float(re.sub('[^0-9]', '', re.search('\s+s\d\d', rating_class).group()))/10
	message = review_container.find_element_by_css_selector('div.entry p').text
	author = review_container.find_element_by_css_selector('div.username').text
	return {'@type':'Review', 'datePublished':date, 'ratingValue':rating, 'reviewBody':message, 'author':{'@type':'Person', 'name':author}}

def if_next_page_exists_go():
	if(max_page > 0 and current_page >= max_page):
		return False

	next_button = driver.find_elements_by_css_selector('a.nav.next')
	if(len(next_button) > 0):
		next_button = next_button[0]
		next_button.click()
		return True
	return False



def try_to_expand_reviews_if_needed():
	more_button = driver.find_elements_by_css_selector('span.partnerRvw span.moreLink')
	if (len(more_button) >= 1):
		more_button = more_button[0]
		more_button_class = more_button.get_attribute("class")
		review_id = re.sub('[^0-9]', '', re.search('tr[0-9]+', more_button_class).group())
		#driver.save_screenshot('before_click.png')
		max_tries = 5
		tries = 0
		while(True):
			try:
				more_button.click()
				tries += 1
				time.sleep(1)
				if(len(driver.find_elements_by_css_selector('#UR%s' % review_id)) > 0):
					break
				if(tries >= max_tries):
					break
			except:
				continue
	return

def isEmailFormModalOpened():
	return len(driver.find_elements_by_css_selector('#emailOnlySignupWrap')) > 0

start()
