<?php
	require_once "defs.php";
	require_once "dbconnect.php";
	
	// Cоединяемся с базой
	//$dbconn = mysql_connect($db_addr, $db_user, $db_passw) or die ('Can\'t connect : ' . mysql_error());
	//$dbselect = mysql_select_db($db_user, $dbconn) or die ('Can\'t use this database: ' . mysql_error());

	$query = 'SELECT count(*) as last FROM scores';
	$result = mysql_query($query) or die('Query failed: ' . mysql_error());
	$line = mysql_fetch_assoc($result);
	$last = $line['last'];
	mysql_free_result($result);
	
	//about you among others	
	$query = 'SELECT rank FROM(SELECT @rn:=@rn+1 as rank, id, score FROM( SELECT id, score FROM scores ORDER BY score DESC)t1, (SELECT @rn:=0)t2) t3 WHERE id=\'' . $_SESSION['me']['id'] . '\'';
	$result = mysql_query($query) or die('Query failed: ' . mysql_error());
	$line = mysql_fetch_assoc($result);
	$your_rank = $line['rank'];
	mysql_free_result($result);
	
	if (($your_rank == 1) or ($your_rank == 2))
	{
		$query = 'SELECT id,score FROM(SELECT @rn:=@rn+1 as rank, id, score FROM(SELECT id, score FROM scores ORDER BY score DESC)t1, (SELECT @rn:=0)t2) t3 WHERE rank in (1,2,3,4,5)';
	}
	elseif (($your_rank == $last) or ($your_rank == $last-1))
	{
		$query = 'SELECT id,score FROM(SELECT @rn:=@rn+1 as rank, id, score FROM(SELECT id, score FROM scores ORDER BY score DESC)t1, (SELECT @rn:=0)t2) t3 WHERE rank in ('.$last .'- 4 , '.$last .'- 3 , '.$last .'- 2 , ' . $last.'- 1 , ' . $last .' )';
	}
	else
	{
		$query = 'SELECT id,score FROM(SELECT @rn:=@rn+1 as rank, id, score FROM(SELECT id, score FROM scores ORDER BY score DESC)t1, (SELECT @rn:=0)t2) t3 WHERE rank in ('.$your_rank .'- 2, '.$your_rank .'- 1, '.$your_rank .' , ' . $your_rank .' + 1 , ' . $your_rank.' + 2 )';
	}
	
	// массив рейтинга пользователей
	$ratingUsers = array();
	$result1 = mysql_query($query);

	for($i = 0; $i < 5; ++$i)
		$ratingUsers[$i] = mysql_fetch_assoc($result1);
		
	$_SESSION['ratingUsers'] = $ratingUsers;
	
	mysql_free_result($result1);
?>

