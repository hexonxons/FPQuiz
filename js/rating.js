/*
 * Класс обработки событий, связанных с рейтингом
 * 
 * Copyright © 2011 Hexonxons
 * 
 * v 1.1
 *  
 */	

// класс рейтинга
function RatingClass(UserId)
{
	// div всей таблицы рейтинга
	var RatingDiv = document.getElementById('rating');
	// массив игроков в рейтинге
	var RatingTable = new Array();
	// объект UserData активного игрока
	var	ActiveUserObject;
	// id игрока
	var MainUserId;
	// позиция игрока в текущем отображаемом рейтинге
	var MainUserRatingPosition;
	
	// класс игрока в таблице рейтинга
	// IN:
	// ---	RatingDiv - div всей таблицы рейтинга
	// ---	i - номер пользователя
	var UserData = function(RatingDiv, i)
	{
		// id пользователя, ассоциированного с этой яйчейкой рейтинга
		this.UserId = "";
		// основной div кнопки рейтинга
		this.MainDiv = RatingDiv.children[i];
		// div позиции игрока в таблице рейтинга
		this.UserRankDiv = this.MainDiv.children[1].children[0];
		// div картинки игрока в таблице рейтинга
		this.UserPicDiv = this.MainDiv.children[1].children[1].children[0];
		// div имени игрока в таблице рейтинга
		this.UserNameDiv = this.MainDiv.children[1].children[2].children[0];
		// div очков игрока в таблице рейтинга
		this.UserScoreDiv = this.MainDiv.children[1].children[2].children[1].children[0];
		// div анимации очков игрока в таблице рейтинга
		this.UserAnimateDiv = this.MainDiv.children[1].children[2].children[1].children[1];
		// позиция в рейтинге
		this.UserPosition;
	}

/*
 * Публичные Методы
 */		
 
 	// функция проверки рейтинга на необходимость обновления
 	// написана через задницу
	this.CheckRating = function()
	{
		if( parseInt(RatingTable[0].UserScoreDiv.innerText) < parseInt(RatingTable[1].UserScoreDiv.innerText) ||
			parseInt(RatingTable[1].UserScoreDiv.innerText) < parseInt(RatingTable[2].UserScoreDiv.innerText) ||
			parseInt(RatingTable[2].UserScoreDiv.innerText) < parseInt(RatingTable[3].UserScoreDiv.innerText) ||
			parseInt(RatingTable[3].UserScoreDiv.innerText) < parseInt(RatingTable[4].UserScoreDiv.innerText))
			UpdateRating();
	}
	
	// функция изменения счета активного игрока
	// IN:
	// ---	points - количество очков, которое должно прибавиться к очкам пользователя
	// ---	isRight - флаг правильного ответа на вопрос
	this.ChangeScore = function(points, isRight)
	{
		// возвращаемые данные для бд
		var reti = new Array();
		
		// если активный игрока - пользователь, запустивший приложение,
		if(ActiveUserObject.UserId == RatingTable[MainUserRatingPosition].UserId)
		{
			// если ответ правильный, то прибавляем к счету пользователя, запустившего приложение points очков
			if(isRight)
			{
				RatingTable[MainUserRatingPosition].UserScoreDiv.innerText = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) + points;
				AnimateScore(RatingTable[MainUserRatingPosition].UserAnimateDiv, '+' + points, '0000ff');
			}
			// если ответ неправильный
			else
			{
				// Если счет игрока, запустившего приложение, больше 100 очков, то вычитаем 2 очка
				if(parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) > 100)
				{
					RatingTable[MainUserRatingPosition].UserScoreDiv.innerText = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) - 2;
					AnimateScore(RatingTable[MainUserRatingPosition].UserAnimateDiv, '-2', 'ff0000');
				}
			}
			// в возвращаемый массив по индексу score кладем значение счета и id пользователя
			reti['score'] = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText);
			reti['id'] = RatingTable[MainUserRatingPosition].UserId;
		}
		// если активный игрока - не игрока, запустивший приложение
		else
		{
			// если ответ правильный, то вычитаем из счета активного игрока points очков
			if(isRight)
			{
				ActiveUserObject.UserScoreDiv.innerText = parseInt(ActiveUserObject.UserScoreDiv.innerText) - points;
				AnimateScore(ActiveUserObject.UserAnimateDiv, '-' + points, 'ff0000');
				
				// в возвращаемый массив по индексу score кладем значение счета и id активного игрока
				reti['score'] = parseInt(ActiveUserObject.UserScoreDiv.innerText);
				reti['id'] = ActiveUserObject.UserId;
			}
			// если ответ неправильный, то вычитаем из счета игрока, запустившего приложение 2 очка
			else
			{
				RatingTable[MainUserRatingPosition].UserScoreDiv.innerText = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) - 2;
				AnimateScore(RatingTable[MainUserRatingPosition].UserAnimateDiv, '-2', 'ff0000')
				
				// в возвращаемый массив по индексу score кладем значение счета и id игрока, запустившего приложение
				reti['score'] = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText);
				reti['id'] = RatingTable[MainUserRatingPosition].UserId;
			}
		}
		return reti;
	}


/*
 * Приватные методы
 */		
 
	// Задание цвета кнопки
	// IN:
	// ---	color - цвет
	// ---	obj - div, включающий в себя всю яйчейку кнопки
	var SetColor = function(color, obj)
	{
		// закрашиваем кнопку
		for(var i = 0; i < 5; ++i)
		{
			obj.children[0].children[i].style.background = color;
			obj.children[2].children[i].style.background = color;
		}
		obj.children[1].style.background = color;
	}
	
	// функция обновления содержимого рейтинга
	// TODO: покорявить php файлы
	var UpdateRating = function()
	{
		// выполняем rating.php для обновления данных в $_SESSION
		$.ajax({
				type 	: 	'GET',
				url 	: 	'rating.php',
				async	: 	false
		});
		
		$.ajax({
				type 	:	'POST',
				url 	: 	'func.php',
				async	: 	true,
				data	: 	{
								'basicRatingSet'	:	true
							},
				success	:	function(json)
							{
								// пользователь играет за себя?
								var isYaPlaying = ActiveUserObject.UserId == RatingTable[MainUserRatingPosition].UserId ? true : false;
								// текущая позиция пользователя
								var MainUserCurrentPosition = MainUserRatingPosition;
								// текущий объект активного игрока
								var ActiveUserCurrentPosition = ActiveUserObject.UserPosition;
								// id активного игрока
								var ActiveUserId = ActiveUserObject.UserId;
								// новая позиция пользователя
								var MainUserNewPosition = 0;
								// новый объект активного игрока
								var ActiveUserNewPosition = 0;
								
								var data = jQuery.parseJSON(json);
								for(var i = 0; i < 5; ++i)
								{
									RatingTable[i].UserId = data[i].id;
									RatingTable[i].MainDiv.id = i;
									RatingTable[i].UserNameDiv.innerText = data[i].name;
									RatingTable[i].UserRankDiv.innerText = data[i].rank;
									RatingTable[i].UserPicDiv.src = data[i].pic;
									RatingTable[i].UserScoreDiv.innerText = data[i].score;
									RatingTable[i].UserPosition = i;
									
									// проверяем нашу позицию в рейтинге
									
									if(MainUserId == data[i].id)
										MainUserNewPosition = i;	
										
									// опуская игрока мы меняем его позицию в рейтинге. Надо оставить его активным
									if(ActiveUserId == data[i].id)
										ActiveUserNewPosition = i;						
								}
								
								if(isYaPlaying && MainUserCurrentPosition != MainUserNewPosition)
								{
									// Если игрок играет за себя и его текущая позиция сменилась, например был 1м, а стал 2м,
									// то задаем его активным(раньше активным была 1я позиция рейтинга) и меняем его номер в рейтинге.
									// 
									// Обычно этот номер = 2.
									SetActiveUser(RatingTable[MainUserNewPosition].MainDiv);
									MainUserRatingPosition = MainUserNewPosition;
								}
								else
									if(!isYaPlaying)
									{
										// Если игрок играет против кого-то, то обновление рейтинга произошло
										// из-за того, что сменилась позиция игрока, либо сменилась позиция того,
										// против кого игрок играет.
										//
										// В 1 случае игрок может сместиться так, что пользователь, против кого игрок играет,
										// окажется более чем на 2 позиции выше в рейтинге, то есть
										// пропадет из текущей отображаемой таблицы рейтинга. Тогда активным пользователем делаем
										// игрока.
										//
										// Во втором случае надо ставить активной позицию того,
										// против кого игрок играет. 
										//
										// Случай <100 очков обрабатывается в самой функции SetActiveUser()
										if(ActiveUserNewPosition != 0)
										{
											SetActiveUser(RatingTable[ActiveUserNewPosition].MainDiv);
											ActiveUserObject = RatingTable[ActiveUserNewPosition];
										}
										else
										{
											SetActiveUser(RatingTable[MainUserNewPosition].MainDiv);
											MainUserRatingPosition = MainUserNewPosition;
										}
										
									}
							}
			});
	}
	
	// инициализация таблицы рейтинга
	var InitRating = function()
	{
		var CellHtml = "\
						<div id = ''style='width: 180px; height: 66px; margin-top: 2px; margin-bottom: 2px'>\
							<div class='Rating-container'>\
								<div class='Rating-1'></div>\
								<div class='Rating-2'></div>\
								<div class='Rating-3'></div>\
								<div class='Rating-4'></div>\
								<div class='Rating-4'></div>\
							</div>\
							<div class='Rating-content'>\
								<div id = '' style='display: table-cell; vertical-align:middle; background : transparent; width : 20px; text-align : center'>\
								</div>\
								<div id='' style='display: table-cell; vertical-align:middle; padding-right:5px; padding-left : 5px; background : transparent'>\
									<img id ='' src=''>\
								</div>\
								<div id='' style='display: table-cell; vertical-align:middle; background : transparent'>\
									<div id = '' style='background : transparent'>\
									</div>\
									<div id = '' style='background : transparent; display: table-cell'>\
										<div style='background : transparent; display: table-cell'>\
										</div>\
										<div style='background : transparent; display: table-cell ;position: relative;'>\
										</div>\
									</div>\
								</div>\
							</div>\
							<div class='Rating-container'>\
								<div class='Rating-4'> </div>\
								<div class='Rating-4'> </div>\
								<div class='Rating-3'> </div>\
								<div class='Rating-2'> </div>\
								<div class='Rating-1'> </div>\
							</div>\
						</div>";
		for(var i = 0; i < 5; ++i)
		{
			RatingDiv.innerHTML += CellHtml;
		}
	}
	
	// выделение div при наведении курсора
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку рейтинга
	var MouseOver = function(obj)
	{
		if(obj.children[1].style.background != "rgb(184, 184, 151)")
		{
			// закрашиваем
			SetColor('#D6D6A9', obj);
		}
	}
	
	// выделение div при уведении курсора
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку рейтинга
	var MouseOut = function(obj)
	{
		if(obj.children[1].style.background != "rgb(184, 184, 151)")
		{
			SetColor('#E0E0A8', obj);
		}
	}
	
	// функция установки игрока активным
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку рейтинга
	//
	// DESC:
	// По сути - выделение кнопки рейтинга другим цветом и установка переменной активного пользователя.
	var SetActiveUser = function(obj)
	{		
		// если активным пользователем хотим сделать не игрока и количество очков игрока < 100,
		// то переключение в режим "игры против" невозможно
		if(RatingTable[parseInt(obj.id)].UserId != RatingTable[MainUserRatingPosition].UserId)
		{
			if(parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) < 100)
			{
				// TODO: нужен ли этот вызов?
				SetActiveUser(RatingTable[MainUserRatingPosition].MainDiv);
				return;
			}
		}
		
		// если активным пользователем хотим сделать не игрока и количество очков игрока, против которого хотим играть < 100,
		// то переключение в режим "игры против" невозможно
		if(parseInt(RatingTable[parseInt(obj.id)].UserScoreDiv.innerText) < 100)
		{
			// TODO: нужен ли этот вызов?
			SetActiveUser(RatingTable[MainUserRatingPosition].MainDiv);
			return;
		}
		
		// убираем выборку предыдущего игрока
		SetColor('#E0E0A8', ActiveUserObject.MainDiv);
		
		// выбираем нового игрока
		ActiveUserObject = RatingTable[parseInt(obj.id)];
		
		// закрашиваем нового игрока
		SetColor('#B8B897', obj);
	}
	
	// анимация счета при ответе
	// IN:
	// ---	obj - div анимации очков пользователя в таблице рейтинга
	// ---	text - текст, который будет в анимации
	// ---	color - цвет текста в анимации
	var AnimateScore = function(obj, text, color)
	{
		$(obj).css('color', color);
		$(obj).text(text);
		$(obj).animate({ "left" : "+=50px"}, 1000);
		$(obj).fadeOut("slow");
		$(obj).animate({ "left" : "-=50px"}, 40);
		$(obj).queue(function () {
			$(this).empty();
			$(this).dequeue();
		});
		$(obj).fadeIn("slow");
	}

/*
 * Основная часть конструктора
 */	
 
	// инициализируем сами div`ы
	InitRating();
	// задаем свой Id
	MainUserId = UserId;
	
	// инициализация массива пользователей
	for(var i = 0; i < 5; ++i)
	{
		RatingTable[i] = new UserData(RatingDiv, i);
		
		// навешиваем обработчики
		$(RatingTable[i].MainDiv).mouseover(function(){
			MouseOver(this);
		});
		$(RatingTable[i].MainDiv).mouseout(function(){
			MouseOut(this);
		});
		$(RatingTable[i].MainDiv).click(function(){
			SetActiveUser(this);
			// TODO: Убрать эту часть за класс
			getNewPicture();
		});
	}
	
	// заполнение массива пользователей
	$.ajax({
				type 	:	'POST',
				url 	: 	'func.php',
				async	: 	false,
				data	: 	{
								'basicRatingSet'	:	true
							},
				success	:	function(json)
							{
								var data = jQuery.parseJSON(json);
								for(var i = 0; i < 5; ++i)
								{
									RatingTable[i].UserId = data[i].id;
									RatingTable[i].MainDiv.id = i;
									RatingTable[i].UserNameDiv.innerText = data[i].name;
									RatingTable[i].UserRankDiv.innerText = data[i].rank;
									RatingTable[i].UserPicDiv.src = data[i].pic;
									RatingTable[i].UserScoreDiv.innerText = data[i].score;
									RatingTable[i].UserPosition = i;
									
									if(MainUserId == data[i].id)
										MainUserRatingPosition = i;
								}
							}
			});
	
	// задаем себя активным игроком
	ActiveUserObject = RatingTable[MainUserRatingPosition];
	SetActiveUser(RatingTable[MainUserRatingPosition].MainDiv);
}	
