import sched, time 
import os
import subprocess
import twittercron

s = sched.scheduler(time.time, time.sleep)

def runevery():
    print("inside .py")
    #twittercron.luigi.task
    command = 'python -m luigi --module twittercron Elasticsearch --index {index} --doctype {doctype} --searchquery {searchquery}'.format(index=os.environ.get('INDEX'),searchquery=os.environ.get('SEARCH_QUERY'),doctype=os.environ.get('DOC_TYPE'))
    subprocess.call(command.split(), shell= False)
    s.enter(86400, 1, runevery) #Change here your cron time
s.enter(10, 1, runevery)
s.run()