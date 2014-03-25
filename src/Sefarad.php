<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Selector de Widgets</title>
</head>
<body>

	<form action="SefaradConf.php" method="post">

		<?php
	 
		if ($gestor = opendir('js/widgets/d3')) {
		    	 
		    /* Esta es la forma correcta de iterar sobre el directorio. */
		    while (false !== ($entrada = readdir($gestor))) {
		    	$w = substr($entrada, 0, (strlen($entrada)-3));
		    	echo ('<input type="checkbox" name="widget[]" value="' . $w . '"> ' . $w . '<br>');	        
		    }
		 
		    closedir($gestor);
		}

		?>

		<input type="submit" value="Enviar" />
	</form>
</body>
</html>