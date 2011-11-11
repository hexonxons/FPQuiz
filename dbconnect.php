<?php
	/*
	 * Connect to db
	 */
	 
	require_once "defs.php";
	
	// Cоединяемся с базой
	$dbconn = mysql_connect($db_addr, $db_user, $db_passw) or die ('Can\'t connect : ' . mysql_error());
	$dbselect = mysql_select_db($db_user, $dbconn) or die ('Can\'t use this database: ' . mysql_error());
?>
