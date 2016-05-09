import json
with open('TuscanyPlaces.json') as f:
    j = json.load(f)

for i in j:
    index = {"index": {"_id": i["id"]}}
    print(json.dumps(index))
    print(json.dumps(i))
