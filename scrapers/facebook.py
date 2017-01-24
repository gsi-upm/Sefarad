import urllib2
import json

class FacebookFanPageCrawler:

	GRAPH_FACEBOOK_URL = 'https://graph.facebook.com/%s%s?access_token=%s'
	oauth_token = None
	page_id = None

	name = None
	pictureUrl = None
	max_pages = 3
	current_pages = 0

	def __init__(self, oauth_token, page_id):
		self.oauth_token = oauth_token
		self.page_id = page_id

	def getNameAndPictureUrl(self):
		try:
			url = 'https://graph.facebook.com/%s/?fields=picture.type(large),name&access_token=%s' % (self.page_id, self.oauth_token)
			json_data = json.load(urllib2.urlopen(url))
			self.name = json_data['name']
			self.pictureUrl = json_data['picture']['data']['url']
		except Exception as e:
			print 'getNameAndPictureUrl %s' % str(e)

	def filterPosts(self, posts):
		posts_filtered = list()
		for post in posts:
			post_filtered = {}
			if 'message' in post:
				post_filtered['message'] = post['message']
			post_filtered['created_time'] = post['created_time']
			post_filtered['id'] = post['id']
			post_filtered['comments'] = []
			posts_filtered.append(post_filtered)
		return posts_filtered

	def getPosts(self):
		posts_filtered = list()
		try:
			url = self.getGraphFacebookUrl(query='posts')
			json_posts = json.load(urllib2.urlopen(url))
			posts_filtered += self.filterPosts(json_posts['data'])
			if 'paging' in json_posts:
				while 'next' in json_posts['paging']:
					url = json_posts['paging']['next']
					json_posts = json.load(urllib2.urlopen(url))
					posts_filtered += self.filterPosts(json_posts['data'])
					self.current_pages += 1
					if(self.current_pages >= self.max_pages):
						break
					has_paging = 'paging' in json_posts
					if has_paging == False:
						break
			return posts_filtered
		except Exception as e:
			print 'getPosts %s' % str(e)
		return posts_filtered

	def getComments(self, post):
		result = list()
		try:
			url = self.getGraphFacebookUrl(object_id=post['id'], query='comments')
			json_posts = json.load(urllib2.urlopen(url))
			result = json_posts['data']
		except Exception as e:
			print 'getComments %s' % str(e)
		return result

	def getGraphFacebookUrl(self, query=None, object_id=None):
		if(object_id == None): object_id = self.page_id
		if(query == None):
			query = ''
		else:
			query = '/%s' % query
		return self.GRAPH_FACEBOOK_URL % (object_id, query, self.oauth_token)


def saveText(text, fileName):
	textutf8 = text.encode('UTF-8')
	text_file = open(fileName, "w")
	text_file.write(textutf8)
	text_file.close()
	return

def startScraping(page_id, resultPath):
	try:
		OAUTH_TOKEN = 'CAACEdEose0cBALYTehwb8asGLj74HKZBHUlpiMvjip5pYIhG1E59WXcNZCVTn7JbxbCDev8rDoyWYVff1tfgyIdLKGMaPXWyAhBPv3WKmWlERA78rUwl5FUIsEdznMSrPGO19MwYtpWxHxeEyTvpJRWeGbZBV2DVZBpZC3y6qWzGNnYIrweiQwMfZCiBZARwn7AKWX0KT0dGgZDZD'
		facebook = FacebookFanPageCrawler(OAUTH_TOKEN, page_id)
		facebook.getNameAndPictureUrl()
		posts = facebook.getPosts()
		#print 'La pagina con id %s tiene %d posts' % (page_id, len(posts))
		i = 0
		for post in posts:
			comments = facebook.getComments(post)
			post['comments'] += comments
			i +=1
		reviews = list()
		for review in posts:
			for comment in review['comments']:
				review_obj = {'@type':'Review',
							  'author':{'name':comment['from']['name'], '@type':'Person'},
							  'datePublished':comment['created_time'],
							  'reviewBody':comment['message']}
				reviews.append(review_obj)
			#print 'Descargados comentarios de %d/%d posts' % (i, len(posts))
		saveText(json.dumps({'@type':'http://schema.org', 'reviews':reviews, 'name':facebook.name, 'image': facebook.pictureUrl}), resultPath)
	except Exception as e:
		print str(e)
		saveText(json.dumps({'loading':False, 'error':str(e)}), resultPath)	