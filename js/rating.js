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
	// массив пользователей в рейтинге
	var RatingTable = new Array();
	// объект UserData пользователя, который считается активным
	var	ActiveUserObject;
	// id пользователя, запустившего приложение
	var MainUserID;
	var MainUserRatingPosition;
	
	// класс пользователя в таблице рейтинга
	// IN:
	// ---	RatingDiv - div всей таблицы рейтинга
	// ---	i - номер пользователя
	var UserData = function(RatingDiv, i)
	{
		// id пользователя, ассоциированного с этой яйчейкой рейтинга
		this.UserId = "";
		// основной div кнопки рейтинга
		this.MainDiv = RatingDiv.children[i];
		// div позиции пользователя в таблице рейтинга
		this.UserRankDiv = this.MainDiv.children[1].children[0];
		// div картинки пользователя в таблице рейтинга
		this.UserPicDiv = this.MainDiv.children[1].children[1].children[0];
		// div имени пользователя в таблице рейтинга
		this.UserNameDiv = this.MainDiv.children[1].children[2].children[0];
		// div очков пользователя в таблице рейтинга
		this.UserScoreDiv = this.MainDiv.children[1].children[2].children[1].children[0];
		// div анимации очков пользователя в таблице рейтинга
		this.UserAnimateDiv = this.MainDiv.children[1].children[2].children[1].children[1];
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
	
	// функция изменения счета активного пользователя
	// IN:
	// ---	points - количество очков, которое должно прибавиться к очкам пользователя
	// ---	isRight - флаг правильного ответа на вопрос
	this.ChangeScore = function(points, isRight)
	{
		// возвращаемые данные для бд
		var reti = new Array();
		
		// если активный пользователь - пользователь, запустивший приложение,
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
				// Если счет пользователя, запустившего приложение, больше 100 очков, то вычитаем 2 очка
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
		// если активный пользователь - не пользователь, запустивший приложение
		else
		{
			// если ответ правильный, то вычитаем из счета активного пользователя points очков
			if(isRight)
			{
				ActiveUserObject.UserScoreDiv.innerText = parseInt(ActiveUserObject.UserScoreDiv.innerText) - points;
				AnimateScore(ActiveUserObject.UserAnimateDiv, '-' + points, 'ff0000');
				
				// в возвращаемый массив по индексу score кладем значение счета и id пользователя
				reti['score'] = parseInt(ActiveUserObject.UserScoreDiv.innerText);
				reti['id'] = ActiveUserObject.UserId;
			}
			// если ответ неправильный, то вычитаем из счета пользователя, запустившего приложение 2 очка
			else
			{
				RatingTable[MainUserRatingPosition].UserScoreDiv.innerText = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) - 2;
				AnimateScore(RatingTable[MainUserRatingPosition].UserAnimateDiv, '-2', 'ff0000')
				
				// в возвращаемый массив по индексу score кладем значение счета и id пользователя
				reti['score'] = parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText);
				reti['id'] = RatingTable[MainUserRatingPosition].UserId;
			}
		}
		return reti;
	}


/*
 * Приватные методы
 */		
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
								var data = jQuery.parseJSON(json);
								var CurrentActiveUserID = 0;
								var CurrentMainPosition = MainUserRatingPosition;
								for(var i = 0; i < 5; ++i)
								{
									RatingTable[i].UserId = data[i].id;
									RatingTable[i].MainDiv.id = i;
									RatingTable[i].UserNameDiv.innerText = data[i].name;
									RatingTable[i].UserRankDiv.innerText = data[i].rank;
									RatingTable[i].UserPicDiv.src = data[i].pic;
									RatingTable[i].UserScoreDiv.innerText = data[i].score;
									// проверяем нашу позицию в рейтинге
									// она могла измениться(со 2й), например на 1ю. Надо бы обновить
									if(MainUserID == data[i].id)
										MainUserRatingPosition = i;
									// да, мы могли играть против человека X и опустить его в задницу за рейтинг.
									// так как продолжать его опускать уже негуманно, надо поставить счетчик на себя.
									// если опустили еще не за границу - надо завершить начатое, ибо нехрен
									if(ActiveUserObject.UserId == data[i].id)
										CurrentActiveUserID = data[i].id;										
								}
								// если ID выбранного пользователя не изменилось, это значит только то,
								// что мы его выкинули за границы рейтинга. Цель достигнута, ставим себя активным
								if(CurrentActiveUserID == 0)
									SetActiveUser(RatingTable[MainUserRatingPosition].MainDiv)
								else	
									// иначе есть еще шанс, что мы опустили себя(или подняли)
									// если наша позиция в таблице рейтинга сменилась, то надо-бы обновится
									if(CurrentMainPosition != MainUserRatingPosition)
									{
										SetActiveUser(RatingTable[MainUserRatingPosition].MainDiv);
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
			// закрашиваем нового игрока
			for(var i = 0; i < 5; ++i)
			{
				obj.children[0].children[i].style.background = 'D6D6A9';
				obj.children[2].children[i].style.background = 'D6D6A9';
			}
			obj.children[1].style.background = 'D6D6A9';
		}
	}
	
	// выделение div при наведении курсора
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку рейтинга
	var MouseOut = function(obj)
	{
		if(obj.children[1].style.background != "rgb(184, 184, 151)")
		{
			// закрашиваем нового игрока
			for(var i = 0; i < 5; ++i)
			{
				obj.children[0].children[i].style.background = 'E0E0A8';
				obj.children[2].children[i].style.background = 'E0E0A8';
			}
			obj.children[1].style.background = 'E0E0A8';
		}
	}
	
	// функция установки игрока активным
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку рейтинга
	var SetActiveUser = function(obj)
	{		
		// если активный пользователь - не пользователь, запустивший приложение
		// и количество очков пользователя, запустившего приложение < 100,
		// то переключение в режим "игры против" невозможно
		if(RatingTable[parseInt(obj.id)].UserId != RatingTable[MainUserRatingPosition].UserId)
		{
			if(parseInt(RatingTable[MainUserRatingPosition].UserScoreDiv.innerText) < 100)
				return;
		}
		
		// убираем выборку предыдущего игрока
		UnsetActiveUser(ActiveUserObject.MainDiv);
		// выбираем нового игрока
		ActiveUserObject = RatingTable[parseInt(obj.id)];
		
		// закрашиваем нового игрока
		for(var i = 0; i < 5; ++i)
		{
			obj.children[0].children[i].style.background = 'B8B897';
			obj.children[2].children[i].style.background = 'B8B897';
		}
		obj.children[1].style.background = 'B8B897';
		
		// TODO: Убрать эту часть за класс
		getNewPicture();
	}

	// функция сброса выделения с игрока, бывшего активным
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку рейтинга
	var UnsetActiveUser = function(obj)
	{
		for(var i = 0; i < 5; ++i)
		{
			obj.children[0].children[i].style.background = 'E0E0A8';
			obj.children[2].children[i].style.background = 'E0E0A8';
		}
		obj.children[1].style.background = 'E0E0A8';
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
	MainUserID = UserId;
	
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
									if(MainUserID == data[i].id)
										MainUserRatingPosition = i;
								}
							}
			});
	
	// задаем себя активным игроком
	ActiveUserObject = RatingTable[MainUserRatingPosition];
	SetActiveUser(RatingTable[MainUserRatingPosition].MainDiv);
	
}	
