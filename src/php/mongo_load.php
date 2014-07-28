<?php

// conectar
$m = new MongoClient();

// select Sefarad Database
$db = $m->sefarad;

// select Configuration collection
$collection = $db->configuration;

// search saved configuration
$query = array( 'name' => 'saved_configuration' );
$cursor = $collection->find( $query );

// load configuration (saved or defatult)
if (($cursor->count()) > 0) {
	foreach ($cursor as $doc) {
	    echo (json_encode(($doc)));
	}
} else {
	$query = array( 'name' => 'default_configuration' );
	$cursor = $collection->find( $query );

	if (($cursor->count()) > 0) {
		foreach ($cursor as $doc) {
		    echo (json_encode(($doc)));
		}
	} else {
		trigger_error("No se encuentra ninguna configuracion", E_USER_ERROR);
	}	
}

?>