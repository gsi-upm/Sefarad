<?php

// Config
$dbhost = 'localhost';
$dbname = 'mydb';

// Connect to test database
$m = new Mongo("mongodb://$dbhost");
$db = $m->$dbname;

// select the collection
$collection = $db->testData;

// pull a cursor query
$cursor = $collection->find();

foreach($cursor as $document) {
 var_dump($document);
 
}

?>