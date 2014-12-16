<?php

require ('../auth/session.php');

// conectar
$m = new MongoClient();

// select Sefarad Database
$db = $m->sefarad;

// select Configuration collection
$collection = $db->dataset;

// search saved configuration
$query = array( "dataset" => "slovakia_minv2");
$cursor = $collection->find( $query );

// load configuration (saved or defatult)
if (($cursor->count()) > 0) {
    foreach ($cursor as $doc) {
        echo (json_encode(($doc)));
    }
} else {
   trigger_error("No dataset found", E_USER_ERROR);
}

?>