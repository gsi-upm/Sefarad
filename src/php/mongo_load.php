<?php

// conectar
$m = new MongoClient();

// seleccionar una base de datos
$db = $m->sefarad;

// seleccionar una colección (equivalente a una tabla en una base de datos relacional)
$collection = $db->configuration;

// encontrar todo lo que haya en la colección
$query = array( 'name' => 'saved_configuration' );
$cursor = $collection->find( $query );

// comprobar si hay configuración guardada y, si no, cargar la configuración por defecto
if (($cursor->count()) > 0) {
	foreach ($cursor as $doc) {
	    echo (json_encode(($doc)));
	}
} else {
	$query = array( 'name' => 'default_configuration' );
	$cursor = $collection->find( $query );

	foreach ($cursor as $doc) {
	    echo (json_encode(($doc)));
	}
}

?>