<?php
	require_once "defs.php";
	
	// если сессия не открыта
	if(!isset($_SESSION['me']))
	{
		// Получаем пользователя
		$user = $facebook->getUser();
		
		if(!empty($user))
		{
			try
			{
				$uid = $facebook->getUser();
				$me = $facebook->api('/me');
			} 
			catch (FacebookApiException $e)
			{
				
				error_log($e);
				debug($e);
			}
		}
		else
		{
			$dialog_url = "https://www.facebook.com/dialog/oauth?client_id=" 
					. $app_id . "&redirect_uri=" . urlencode($canvas_page);
			// И редиректим обратно после авторизации
			echo("<script> top.location.href='" . $dialog_url . "'</script>");
		}
		
		$_SESSION['me'] = $me;
		
		// проверка на то, что пользователь есть в нашей бд пользователей
		$query = 'SELECT name FROM fbuser WHERE name=\'' . $me['name'] . '\'';
		$result = mysql_query($query)or die('Query failed: ' . mysql_error());
		
		// Получаем ответ от базы
		$line = mysql_fetch_assoc($result);
		$flag = ($line['name'] == $me['name']);
		
		// Очищаем переменную
		mysql_free_result($result);
		
		// Если пользователя нет, то добавляем его в базу
		if(!$flag)
		{
			$query = 'INSERT INTO fbuser VALUES (\'' . $me['id'] . '\',\'' . mysql_real_escape_string($me['name']) . '\',\'' . mysql_real_escape_string($me['first_name']) . '\',\'' . mysql_real_escape_string($me['last_name']) . '\',\'' . $me['link'] . '\',\'' . mysql_real_escape_string($me['username']) . '\',\'' . $me['hometown']['id'] . '\',\'' . mysql_real_escape_string($me['hometown']['name']) . '\',\'' . $me['location']['id'] . '\',\'' . mysql_real_escape_string($me['location']['name']) . '\',\'' . mysql_real_escape_string($me['bio']) . '\',\'' . mysql_real_escape_string($me['quotes']) . '\',\'' . $me['gender'] .'\',\'' . $me['timezone'] . '\',\'' . $me['locale'] . '\',\'' . $me['updated_time'] . '\');';
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
			mysql_free_result($result);

			$query = 'INSERT INTO scores VALUES (\'' . $me['id'] . '\',\'' . 0 . '\',\'' . 0 . '\');';
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
			mysql_free_result($result);
		}
	}
?>
