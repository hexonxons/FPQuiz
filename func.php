<?php
	require_once "defs.php";
	require_once "dbconnect.php";
	
	function getScore($id)
	{
		$query_question  = 'SELECT score, attempts FROM scores WHERE id=\'' . $id . '\'';
		$result_question = mysql_query($query_question) or die('Query failed: ' . mysql_error());
		$line = mysql_fetch_assoc($result_question);
		mysql_free_result($result_question);
		$message = array('score'=>$line['score'], 'attempts'=>$line['attempts']);
		return json_encode($message);
	}
	
	function setScore($data, $id, $attempts)
	{
		$query_question = 'UPDATE scores SET score = \'' . $data . '\', attempts = \'' . $attempts . '\' WHERE id = \'' . $id . '\';'; 
		$result = mysql_query($query_question);
	}
	
	function getNewPicture()
	{
		$variants = array("1","2","3","4");
		srand((double) microtime()*1000000);
		$right = rand(0,3);
		$id = rand(1, 590);
			
		$query_question = 'SELECT answer, tags, level, num, points FROM question WHERE id = '.$id.'';
		$result_question = mysql_query($query_question) or die('Query failed: ' . mysql_error());
		$line1 = mysql_fetch_assoc($result_question);
		$level = $line1['level'];
		$variants[$right]=$line1['answer'];
		mysql_free_result($result_question);
		for ($i=0; $i<=3; $i++)
		{
			if ($i != $right)
			{
				$query_question = 'SELECT answer FROM question WHERE (level = '.$level.' and answer not in (\'' . $variants[0]. '\', \'' . $variants[1]. '\',\'' . $variants[2]. '\',\'' . $variants[3]. '\')) ORDER BY RAND() limit 1';
				$result_question = mysql_query($query_question) or die('Query failed: ' . mysql_error());
				$line2 = mysql_fetch_assoc($result_question);
				$variants[$i]=$line2['answer'];
				mysql_free_result($result_question);
			}
		}
		$message = array('answer'=>$line1['answer'], 'tags'=>$line1['tags'], 'num'=>$line1['num'], 'points'=>$line1['points'],'var0'=>$variants[0], 'var1'=>$variants[1], 'var2'=>$variants[2], 'var3'=> $variants[3]);
		return json_encode($message);
	}
	
	function GetRating($facebook)
	{	
		$query = 'SELECT rank FROM(SELECT @rn:=@rn+1 as rank, id, score FROM( SELECT id, score FROM scores ORDER BY score DESC)t1, (SELECT @rn:=0)t2) t3 WHERE id=\'' . $_SESSION['me']['id'] . '\'';
		$result = mysql_query($query) or die('Query failed: ' . mysql_error());
		$line = mysql_fetch_assoc($result);
		$rank = $line['rank'];
		mysql_free_result($result);
		
		$reti = Array();
		$userdata[] = Array();
		
		for($i = 0; $i < 5; ++$i)
		{
			$name = $facebook->api('/' . $_SESSION['ratingUsers'][$i]['id']);
			$userdata['id'] = $_SESSION['ratingUsers'][$i]['id'];
			$userdata['name'] = $name['first_name'];
			$userdata['rank'] = $rank - 2 + $i;
			$userdata['pic'] = "https://graph.facebook.com/". $_SESSION['ratingUsers'][$i]['id'] . "/picture";
			$userdata['score'] = $_SESSION['ratingUsers'][$i]['score'];
			$reti[$i] = $userdata;
		}
		return json_encode($reti);
	}	
	
	if (isset($_POST['getScore']))
	{
		echo getScore($_POST['id']);
		//mysql_close($dbconn);
	}
	
	if (isset($_POST['setScore']))
	{
		setScore($_POST['score'], $_POST['id'], $_POST['attempts']);
		//mysql_close($dbconn);
	}
	
	if (isset($_REQUEST['getNewPicture']))
	{
		echo getNewPicture();
		//mysql_close($dbconn);
	}
	
	if (isset($_POST['basicRatingSet']))
	{
		echo GetRating($facebook);
		//mysql_close($dbconn);
	}
	
?>
