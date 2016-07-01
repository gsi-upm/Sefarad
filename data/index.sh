#!/bin/bash

ENDPOINT=$1

for f in elk_*.txt
do
	echo "Indexing $f..."
	curl -XPOST $ENDPOINT --data-binary @$f
	echo "Done"
done
