import os
import re

def startScraping(video_id, resultPath):
	os.chdir('./scrapers/spiders')
	scriptPath = 'youtube.py'
	params = '--videoid="%s" --path="%s"' % (video_id, resultPath)
	os.system('python %s %s' % (scriptPath, params))
	os.chdir('../..')