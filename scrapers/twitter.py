from twython import Twython
import json
import argparse

def filter_tweet(tweet):
	result = {}
	result['@type'] = 'Review'
	result['reviewBody'] = tweet['text']
	result['author'] = {'@type':'Person', 'name':tweet['user']['name']}
	result['datePublished'] = tweet['created_at']
	return result

def retrieve_tweets(hashtag, count=200):
	TWITTER_APP_KEY = 'C5UWRDmgHyl5Bl1Wj8tJ2kw0b'
	TWITTER_APP_KEY_SECRET = 'l4wD6buK0LfIp4KttBKOycNpbcJ9S1KLPR0l30Y17PPE0tpmzI' 
	TWITTER_ACCESS_TOKEN = '135293172-H0s02gtNpZzIL9iSTid5jrJk6KtUKF88QypfRasb'
	TWITTER_ACCESS_TOKEN_SECRET = '6XnRw9r1Fxt2a79tqqgLdq6M3OFX369mlDN4p7krBSBpQ'

	t = Twython(app_key=TWITTER_APP_KEY, 
	            app_secret=TWITTER_APP_KEY_SECRET, 
	            oauth_token=TWITTER_ACCESS_TOKEN, 
	            oauth_token_secret=TWITTER_ACCESS_TOKEN_SECRET)

	search = t.search(q=hashtag,   #**supply whatever query you want here**
	                  count=count)

	tweets = search['statuses']

	filtered_tweets = list()

	for tweet in tweets:
		filtered_tweet = filter_tweet(tweet)
		if(filtered_tweet != None):
			filtered_tweets.append(filtered_tweet)
	  #print json.dumps(tweet)
	  #print tweet['id_str'], '\n', tweet['text'], '\n\n\n'

	item = {'@context':'http://schema.org','name':hashtag, 'image':'https://www.samuelparra.com/wp-content/uploads/2015/03/twitter-logo.png', 'reviews':filtered_tweets}

	return item

def start():
	parser = argparse.ArgumentParser(description='Retrieve tweets by hashtag.')
	parser.add_argument('--hashtag', metavar='N', type=str, nargs='+',
                   help='Hashtag to retrieve tweets')
	args = parser.parse_args()

	retrieve_tweets(args.hashtag)

def startScraping(hashtag, resultPath):
	scrapy_result = retrieve_tweets(hashtag)
	with open(resultPath, 'w') as file:
		file.write(json.dumps(scrapy_result))