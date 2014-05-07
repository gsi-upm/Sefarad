<?php

$ac = $_REQUEST['actual_configuration'];

// connect to Mongo
$m = new MongoClient();

// select Sefarad DataBase
$db = $m->sefarad;

// select Configuration collection
$collection = $db->configuration;

// delete old saved configuration
$collection->remove(array( 'name' => 'saved_configuration' ));

// save new configuration
$document = json_decode($ac,true);

unset($document['_id']);

$collection->insert($document);	

echo (json_encode(array('my_message' => $ac)));

?>