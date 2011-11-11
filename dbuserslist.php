<?php
	require_once "defs.php";
    require_once "dbconnect.php";
    
	// Performing SQL query
	$query = 'SELECT * FROM fbuser';
	$result = mysql_query($query);

	// Printing results in HTML
	echo "<table>\n";
	while ($line = mysql_fetch_assoc($result)) {
		echo "\t<tr>\n";
		foreach ($line as $col_value) {
			echo "\t\t<td>$col_value</td>\n";
		}
		echo "\t</tr>\n";
	}
	echo "</table>\n";
	mysql_free_result($result);
	mysql_close($dbconn);
?>
