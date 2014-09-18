<?php

require ('../auth/session.php');

if (isset($_SESSION['user_id'])){

	$ac = $_REQUEST['actual_configuration'];

	// connect to Mongo
	$m = new MongoClient();

	// select Sefarad DataBase
	$db = $m->sefarad;

	// select Configuration collection
	$collection = $db->configuration;

	// delete old saved configuration
	$collection->remove(array( 'name' => 'saved_configuration', 'user_id' => $_SESSION['user_id']));

	// save new configuration
	$document = json_decode($ac,true);

	unset($document['_id']);

	$document['user_id'] = $_SESSION['user_id'];

	$collection->insert($document);	

	echo (json_encode(array('my_message' => $ac)));

}

?>