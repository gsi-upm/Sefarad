<?php

require ('../auth/session.php');

if (isset($_SESSION['user_id'])){

	// connect to Mongo
	$m = new MongoClient();

	// select Sefarad DataBase
	$db = $m->sefarad;

	// select Configuration collection
	$collection = $db->configuration;

	// delete old saved configuration
	$collection->remove(array( 'name' => 'saved_configuration', 'user_id' => $_SESSION['user_id']));

}

?>