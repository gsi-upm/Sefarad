<?php
$action = (!empty($_POST['login']) && ($_POST['login'] === 'Log in')) ? 'login' : 'show_form';
switch ($action) {
case 'login':
	require ('session.php');

	require ('user.php');

	$user = new User();
	$username = $_POST['username'];
	$password = $_POST['password'];
	if ($user->authenticate($username, $password)) {
		$_SESSION['user_name'] = $username;
		break;
	}
	else {
		$errorMessage = "Username/password did not match.";
		break;
	}

case 'show_form':
default:
	$errorMessage = NULL;
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<link rel="stylesheet" href="style.css" />
		<title>User Login</title>
	</head>
	<body>
		<div id="contentarea">
			<div id="innercontentarea">
				<h1>Log in here</h1>
				<div id="login-box">
					<div class="inner">
						<form id="login" action="login.php" method="post" accept-charset="utf-8">
							<ul>
								<?php if(isset($errorMessage)): ?>
								<li><?php echo $errorMessage; ?></li>
								<?php endif ?>
								<?php if(isset($_SESSION['user_id'])): ?>
								<li><?php echo ($_SESSION['user_name']) ?></li>
								<?php endif ?>
								<li>
									<label>Username </label>
									<input class="textbox" tabindex="1" type="text" name="username" autocomplete="off"/>
								</li>
								<li>
									<label>Password </label>
									<input class="textbox" tabindex="2" type="password" name="password"/>
								</li>
								<li>
									<input id="login-submit" name="login" tabindex="3" type="submit" value="Log in" />
								</li>
								<li class="clear"></li>
							</ul>
						</form>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>