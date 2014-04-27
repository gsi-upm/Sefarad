<?php

$ac = $_REQUEST['actual_configuration'];

// conectar
$m = new MongoClient();

// seleccionar una base de datos
$db = $m->sefarad;

// seleccionar una colección (equivalente a una tabla en una base de datos relacional)
$collection = $db->configuration;

// eliminar previa configuracion guardada
$collection->remove(array( 'name' => 'saved_configuration' ));

// guardar nueva configuración
$document = json_decode($ac,true);

unset($document['_id']);

$collection->insert($document);	

echo (json_encode(array('my_message' => $ac)));

?>