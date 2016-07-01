#!/bin/bash

for f in *Places.json;
do
	FILE_NAME=$(basename $f .json)
	python conv.py $f > "elk_${FILE_NAME}.txt"
done
