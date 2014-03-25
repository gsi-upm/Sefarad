<html>
<head>
<title>Selector de Widgets</title>
</head>
<body>
 <?php
	$fp = fopen ( 'js/widgets/widgets.txt', 'w' );

	if(!empty($_POST['widget'])) {
		foreach($_POST['widget'] as $widget) {
			echo ('<p>' . $widget . ' checked</p>');
			fwrite ( $fp, $widget . "," );
		}
	} else {
		echo '<p>Nothing Checked</p>';
	}
	
	fclose ( $fp );

	$salida = shell_exec('grunt php');

	echo "<pre>$salida</pre>";
	
	?>
 </body>
</html>