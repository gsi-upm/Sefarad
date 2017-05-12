#!/bin/sh
curl -XPUT http://localhost:9200/tourpedia/_mapping/places -d '
{
  "properties": {
    "location": { 
      "type":     "text",
      "fielddata": true
    },
     "category": { 
      "type":     "text",
      "fielddata": true
    }
  }
}'