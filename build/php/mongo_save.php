<?php

// conectar
$m = new MongoClient();

// seleccionar una base de datos
$db = $m->sefarad;

// seleccionar una colección (equivalente a una tabla en una base de datos relacional)
$collection = $db->configuration;

// añadir un registro
$str = '{"name": "default_configuration", "autocomplete": {"field": "","actived": true }}';

$document = json_decode($str,true);

$collection->insert($document);	

?>