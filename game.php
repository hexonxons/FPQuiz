<?php
	/*
	 * Game file
	 */	
	session_start();
	header("Content-type: text/html; charset=utf-8");
	
    require_once "defs.php";
    require_once "dbconnect.php";
    require_once "auth.php";
    require_once "rating.php";
    require_once "func.php";
    
	//mysql_close($dbconn);
?>

<script src="js/jquery-1.6.4.min.js" 					 	type="text/javascript"></script> 
<script src="http://connect.facebook.net/en_US/all.js"	 	type="text/javascript"></script>

<script src="js/game.js" 					 				type="text/javascript"></script>
<script src="js/rating.js" 					 			type="text/javascript"></script>
<script src="js/funcbutton.js" 					 			type="text/javascript"></script>
<script src="js/jquery.easing.1.3.js" 					type="text/javascript"></script>
<script src="js/jquery.bouncebox.1.0.js" 					type="text/javascript"></script>

<script type="text/javascript">
	
	var ans = "";
	// общий счет
	var MyScore = 0;
	// количество попыток
	var attempts = 0;
	var photoURL;
	var div;
	var isRight;
	var points = 0;		
	
	var RatingTable;
	var FuncButtons;
	
	// ID пользователя, который играет
	var MyUserId = <? echo $_SESSION['me']['id']?>;
	

	// выполняется по загрузке документа
	$(document).ready(function(){
			$.ajax({
				type 	:	'POST',
				url 	:	'func.php',
				dataType:	'json', 
				async	:	false, 
				data	:	{
								'id'		:MyUserId,
								'getScore'	:true
							},
				success	:	function(json)
							{
								getScore = true;
								MyScore = json.score;
								attempts = json.attempts;
							}
			});
			
			div = document.getElementById('where_is_it');
			div.style.color = '#00ff00';
			
			$('#where_is_it').text(MyScore);
			RatingTable = new RatingClass();
			FuncButtons = new FuncButtonClass();
		});  

        
	function getNewPicture()
	{
		$.getJSON('func.php?getNewPicture', function(obj)
		{
			var tags = obj.tags;
			points = obj.points;
			jQuery('#a-link').remove();
			var apiKey = 'c96fc17af511ecd80f566e7f8ea8c6ea';

			// Ищем картинку
			var num = Math.random()*100;
			$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + apiKey + '&tags='+tags+'&tag_mode=bool&sort=interestingness-desc&per_page=1&page='+num+'&format=json&jsoncallback=?',
			
			function(data)
			{
				if (data.photos.photo.length >=1)
				{
					// Проходим по результатам
					$.each(data.photos.photo, function(i,item)
					{
						// Строим URL фотографии
						photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';	
						// Ассоциируем переменную с фотографией
						var photoID = item.id;    

						// Получаем теги
						$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + apiKey + '&photo_id=' + photoID + '&format=json&jsoncallback=?',

						function(data)
						{						
							$('#flickrimg').attr({src: photoURL});
							delete pLocation;
							// Задаем варианты ответа            
							$('#variant1').text(obj.var0);
							$('#variant1').attr('value', obj.var0);
							$('#variant2').text(obj.var1);
							$('#variant2').attr('value', obj.var1);
							$('#variant3').text(obj.var2);
							$('#variant3').attr('value', obj.var2);
							$('#variant4').text(obj.var3);
							$('#variant4').attr('value', obj.var3);

							ans = obj.answer;	
						});                        
					});
				}
				else 
				{
					getNewPicture();
				}	  
			});  
		             
		});             
	}
	
	function checkAnswer(buttonID)
	{
		isRight = 0;
		++attempts;
		
		var clickedButton = document.getElementById(buttonID);
		
		if (ans == clickedButton.value)
		{
			$('#answer').css('background', '34c924');
			
			isRight = 1;
			// убираем накрутку счетчика
			$('#variant1').attr('value', 0);
			$('#variant2').attr('value', 0);
			$('#variant3').attr('value', 0);
			$('#variant4').attr('value', 0);
			
			var newScoreSet = RatingTable.ChangeScore(parseInt(points), isRight);
			$.ajax({
				type : 'POST',
				url : 'func.php',
				async: false,
				data: {
					'setScore'	:	true,
					'score' 	: 	newScoreSet['score'],
					'id'		:	newScoreSet['id'],
					'attempts' 	: 	attempts
				}});
		}
		else
		{
			$('#answer').css('background', 'ff0033');
			
			// убираем накрутку счетчика
			$('#variant1').attr('value', 0);
			$('#variant2').attr('value', 0);
			$('#variant3').attr('value', 0);
			$('#variant4').attr('value', 0);
			
			var newScoreSet = RatingTable.ChangeScore(parseInt(points), isRight);
			
			$.ajax({
				type : 'POST',
				url : 'func.php',
				async: false,
				data: {
					'setScore'	:	true,
					'score' 	: 	newScoreSet['score'],
					'id'		:	newScoreSet['id'],
					'attempts' 	: 	attempts
				}});
		}	
			
		// show the correct answer 	
		$('#answer').fadeIn("slow");
		$('#answer').text(ans);
		$('#answer').animate({ "top" : "+=50px"}, 1000);
		$('#answer').animate({ "top" : "-=50px"}, 1000);
		$('#answer').fadeOut("slow");
		getNewPicture();
		RatingTable.CheckRating();
	}

	// Пригласить пользователя в приложение
	function Invite()
	{
		FB.ui
		(
			{
				method: "apprequests",
				message: "You should play this funny app!",
				data: "I like this picture",
				title: "Invite your friends to play this app!"
			}
		);	
	}
	
	// Отправить картинку себе на стену
	function PostPicture()
	{
		FB.ui
		(
			{
				method: "feed",
				app_id: '199187416780329',
				picture: photoURL,
				link: "http://apps.facebook.com/flpquiz/game.php",
				message: "I like this picture",
				name: "Click here to play!"			
			}
		);		
	}
</script>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="stylesheet" type="text/css" href="css/invitebutton.css">
		<link rel="stylesheet" type="text/css" href="css/ratingbutton.css">
		<title>Where is it?</title>
	</head>
	<body>
	<div id="fb-root"></div>
		<script>
			FB.init
			(			
				{
					appId  : '199187416780329',
					status : true,
					cookie : true,
					xfbml  : true
				}
			);
		</script>
		<div id="container">
			<div id='header'>

			</div>
			<img src="./pictures/header3.gif" width=100% alt="" />
			
			<table>
			<td>
			<div id="content">
				
				<div id='where_is_it'>			
				</div>  
					
				<div id='scores'>	
				</div>
			
				<div id='tst'>
					<img id="flickrimg"/>
					<div id='answer'></div>
				</div>
				
				<div id='addScores'></div>
				

				<p style="margin-left:7px">
					<button id ="variant1" class="button variant" onclick='checkAnswer(this.id)'></button>
					<button id ="variant2" class="button variant" onclick='checkAnswer(this.id)'></button>
					<button id ="variant3" class="button variant" onclick='checkAnswer(this.id)'></button>
					<button id ="variant4" class="button variant" onclick='checkAnswer(this.id)'></button>
				</p>
				
				<!--<div id='button_head2'>
					<a title="Post picture" class="button post" onClick='PostPicture()' ></a>
				</div> -->
				
				<iframe src="http://www.facebook.com/plugins/like.php?href=http://apps.facebook.com/flpquiz/game.php&amp;
					 layout=standard&amp;
					 show_faces=true&amp;
					 width=500&amp;
					 action=like&amp;
					 font=arial&amp;
					 colorscheme=light&amp;
					 height=50" 
					 scrolling="no" frameborder="0" style="border:none; 
					 overflow:hidden;
					 position: left;
					 margin-left: 0px; 
					 width:450px; 
					 height:90px;" 
					 allowTransparency="true">
				</iframe>
				
			</div>
							
			<td style="vertical-align : top; position:absolute;">
			
			<div id='sidebar'>
			
			<div id='fbuttons' style="position: absolute; width: 200px;"></div>
				<!--<div title="Invite friends" style="display: table-cell; background-image: url('pictures/Invite friends.png'); height:90px; width:100px; margin-left : 10px;" onClick='Invite()'>
				</div>
				<div style="display: table-cell; background:transparent; height:90px; width:5px; ">
				</div>
				<div title="Post picture" style="display: table-cell; background-image: url('pictures/Post picture.png'); height:90px; width:90px; " onClick='PostPicture()'>
				</div>
								
			</div>-->
				
				<h1>Scoresheet</h1>
				
				<div id='rating'>
				</div>
				
				<!--<p style="margin-top:10px">
					<center><a title="Invite friends" class="button invite" onClick='Invite()' ><a></center>
				</p>-->
				
			</div>
			</td>
			</table>
			
			<div id="footer"> HEX Technologies</div>
			</div> </td>
			
			<a class="button" href="#">Tratata</a>
			<div id="box">
				<p><b>New option!</b>You can УМЕНЬШИТЬ the results of your friends. Click the icon of your friend and the score for your correct answers will be substracted from his rating! </p>
			</div>
			
	</body>
</html>
