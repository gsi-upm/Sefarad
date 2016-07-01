import json
import sys

with open(sys.argv[1]) as f:
    j = json.load(f)

for i in j:
    index = {"index": {"_id": i["id"]}}
    print(json.dumps(index))
    print(json.dumps(i))
