<?php
	/*
	 * Game file
	 */	
	session_start();
	header("Content-type: text/html; charset=utf-8");
	
    require_once "defs.php";
    require_once "auth.php";
    require_once "rating.php";
    require_once "func.php";
?>

<script src="js/jquery-1.6.4.min.js" 					 	type="text/javascript"></script> 
<script src="http://connect.facebook.net/en_US/all.js"	 	type="text/javascript"></script>

<script src="js/game.js" 					 				type="text/javascript"></script>
<script src="js/rating.js" 					 				type="text/javascript"></script>
<script src="js/button.js" 					 				type="text/javascript"></script>
<script src="js/jquery.easing.1.3.js" 						type="text/javascript"></script>
<script src="js/jquery.bouncebox.1.0.js" 					type="text/javascript"></script>

<script type="text/javascript">
	
	var ans = "";
	// общий счет
	var MyScore = 0;
	// количество попыток
	var isAnswered;
	var attempts = 0;
	var photoURL;
	var isRight;
	var points = 0;		
	var RatingTable;
	var FuncButtons;
	var FlickrImage;
	// ID пользователя, который играет
	var MyUserId = <? echo $_SESSION['me']['id']?>;
	var AnswerButton1;
	var AnswerButton2;
	var AnswerButton3;
	var AnswerButton4;
	var isNewsButtonPressed = false;

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
			
			RatingTable = new RatingClass(MyUserId);
			
			$('#where_is_it').css('color', '#dfecaa');	
			$('#where_is_it').text(MyScore);
			
			FlickrImage = $('#flickrimg');
			FlickrImage.css('opacity', '0.0');
			
			document.getElementById('flickrimg').onload = function()
			{
				FlickrImage.animate({opacity: 1.0}, 1000);
				$('div[id*="variant"] .Btn-content .Caption').animate({opacity: 1}, 1000);
				$('div[id*="variant"] .Btn-content').animate({height: '30px'}, 1000);	
			}

			{
				// Инит функциональных кнопок
				var func = {f:function(){Invite();}};
				var InnerButtonElementHtml = "<img src='./pictures/InviteFriends.png' style='width: 60px'>";
				var InviteFriendsBtn = new ButtonClass("InviteFriendsButton",
										60, 
										70, 
										'#E0E0A8', 
										'#D6D6A9', 
										'#B8B897',
										func.f,
										InnerButtonElementHtml,
										"Invite friends");
										
				func = {f:function(obj){PostPicture(obj);}};
				var InnerButtonElementHtml = "<img src='./pictures/PostPicture.png' style='width: 60px'>";
				var PostPictureBtn = new ButtonClass("PostPictureButton",
										60, 
										70, 
										'#E0E0A8', 
										'#D6D6A9', 
										'#B8B897',
										func.f,
										InnerButtonElementHtml,
										"Post picture");
			}
			
			{
				// Инит кнопок ответа
				var AnswerFunction = {func:function(obj){checkAnswer(obj);}};
				
				var InnerButtonElementHtml = "<div id='ans'></div>";
				AnswerButton1 = new ButtonClass("variant1",
										120, 
										40, 
										'#668BD9',
										'#87ACFA', 
										'#BDBEF0',
										AnswerFunction.func,
										InnerButtonElementHtml);
				AnswerButton2 = new ButtonClass("variant2",
										120, 
										40,
										'#668BD9',
										'#87ACFA', 
										'#BDBEF0',
										AnswerFunction.func,
										InnerButtonElementHtml);
				AnswerButton3 = new ButtonClass("variant3",
										120, 
										40, 
										'#668BD9',
										'#87ACFA', 
										'#BDBEF0',
										AnswerFunction.func,
										InnerButtonElementHtml);
				AnswerButton4 = new ButtonClass("variant4",
										120, 
										40,
										'#668BD9',
										'#87ACFA', 
										'#BDBEF0',
										AnswerFunction.func,
										InnerButtonElementHtml);
			}

			// Конвертируем тег div #box в bounceBox
			$('#box').bounceBox();
			
			// Если в области выпадающего окна была нажата кнопка мыши, то открываем окно
			$('#box').click(function(){
				$('#box').bounceBoxHide();
				$('#buttonnew').css('background', "url('pictures/button.gif')");
				isNewsButtonPressed = !isNewsButtonPressed;
			});
			
			getNewPicture();
		});  

        
	function getNewPicture()
	{
		$.getJSON('func.php?getNewPicture', function(obj)
		{
			points = obj.points;
			var apiKey = 'c96fc17af511ecd80f566e7f8ea8c6ea';

			// Ищем картинку
			var num = Math.random()*100;
			$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + apiKey + '&tags=' + obj.tags + '&tag_mode=bool&sort=interestingness-desc&per_page=1&page=' + num + '&format=json&jsoncallback=?',	
			function(data)
			{
				if (data.photos.photo.length >=1)
				{
					// Проходим по результатам
					$.each(data.photos.photo, function(i, item)
					{
						// Строим URL фотографии
						photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';	
						// Ассоциируем переменную с фотографией
						var photoID = item.id;    

						// Получаем теги
						$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + apiKey + '&photo_id=' + photoID + '&format=json&jsoncallback=?',

						function(data)
						{	

							FlickrImage.animate({opacity: 0.0}, 1000);
							$('div[id*="variant"] .Btn-content .Caption').animate({opacity: 0.0}, 200);
							$('div[id*="variant"] .Btn-content').animate({height: '0px'}, 1000);
								
							FlickrImage.attr({src: photoURL});
							
							// Задаем варианты ответа            
							AnswerButton1.SetInnerVal("<div class='Caption' style='position: relative; vertical-align: middle; top: 5px; opacity: 0'>" + obj.var0 + "</div>")
							AnswerButton2.SetInnerVal("<div class='Caption' style='position: relative; vertical-align: middle; top: 5px; opacity: 0'>" + obj.var1 + "</div>")
							AnswerButton3.SetInnerVal("<div class='Caption' style='position: relative; vertical-align: middle; top: 5px; opacity: 0'>" + obj.var2 + "</div>")
							AnswerButton4.SetInnerVal("<div class='Caption' style='position: relative; vertical-align: middle; top: 5px; opacity: 0'>" + obj.var3 + "</div>")

							ans = obj.answer;	
							isAnswered = false;
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
	
	function checkAnswer(obj)
	{
		if(!isAnswered)
		{
									
							
			PressedButtonId = obj.id;
			isRight = 0;
			++attempts;
			isAnswered = true;
			
			if (ans == obj.children[1].children[0].innerText)
			{
				$('#answer').css('background', '34c924');
				
				isRight = 1;
				
				var newScoreSet = RatingTable.ChangeScore(parseInt(points), isRight);
				if(newScoreSet['id'] == MyUserId)
					$('#where_is_it').text(newScoreSet['score']);
					
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
				
				var newScoreSet = RatingTable.ChangeScore(parseInt(points), isRight);
				if(newScoreSet['id'] == MyUserId)
					$('#where_is_it').text(newScoreSet['score']);
					
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
	
	function onNewButtonClick(obj)
	{
		if(!isNewsButtonPressed)
		{
			$(obj).css('background', "url('pictures/button_push_light.gif')");
			$('#box').bounceBoxToggle();
			isNewsButtonPressed = !isNewsButtonPressed;
			//obj.preventDefault();
		}
		else
		{
			$('#box').bounceBoxHide();
			$(obj).css('background', "url('pictures/button.gif')");
			isNewsButtonPressed = !isNewsButtonPressed;
		}
			
	}
</script>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="stylesheet" type="text/css" href="css/button.css">
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
				<div id='where_is_it'></div>  	
				<div id='scores'></div>
				<div id='tst'>
					<img id="flickrimg"/>
					<div id='answer'></div>
				</div>
				<div id='addScores'></div>
				<p style="margin-left:7px">			
					<div id ="variant1" style=""></div>
					<div id ="variant2" style="left: 140px;"></div>
					<div id ="variant3" style="left: 270px;"></div>
					<div id ="variant4" style="left: 400px;"></div>
				</p>
				
				<iframe src="http://www.facebook.com/plugins/like.php?href=http://apps.facebook.com/flpquiz/game.php&amp;
					 layout=standard&amp;
					 show_faces=true&amp;
					 width=500&amp;
					 action=like&amp;
					 font=arial&amp;
					 colorscheme=light&amp;
					 height=50" 
					 scrolling="no"
					 frameborder="0"
					 style="border:none; 
					 overflow:hidden;
					 position: relative;
					 margin-left: 0px; 
					 width:450px; 
					 height:90px;
					 bottom:-50px;" 
					 allowTransparency="true">
				</iframe>
			</div>
							
			<td style="vertical-align : top; position:absolute;">
				<div id='sidebar'>
					<div id='fbuttons' style="position: absolute; width: 200px;">
						<div id='InviteFriendsButton' style='right: 25px;'></div>
						<div id='PostPictureButton' style='left: 25px;'></div>
					</div>
					<h1>Scoresheet</h1>
					<div id='rating'></div>
					<button id='buttonnew' class="button new" style ='position: absolute; top: 500px;' onclick='onNewButtonClick(this)'></button>
				</div>
			</td>
			</table>
			
			<div id="footer" style='position:relative; bottom:-50px;'> HEX Technologies //dev 1.1.0</div>
			</div> </td>
			
			<div id="box">
				<p><b>New option!</b>Вы можете не только увеличивать свои очки путем правильного ответа на вопросы, но и уменьшать очки ближайших к вам конкурентов! Щелкните на иконку противника и продолжайте играть.</p>
			</div>
			
	</body>
</html>
