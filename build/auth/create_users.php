<?php
require ('dbconnection.php');

$mongo = DBConnection::instantiate();
$collection = $mongo->getCollection('users');
$users = array(
	array(
		'name' => 'admin',
		'username' => 'admin',
		'password' => md5('1234') ,		
	) ,
	array(
		'name' => 'admin2',
		'username' => 'admin2',
		'password' => md5('1234') ,
	) 
);

foreach($users as $user) {
	try {
		$collection->insert($user);
	}

	catch(MongoCursorException $e) {
		die($e->getMessage());
	}
}

echo 'Users created successfully';