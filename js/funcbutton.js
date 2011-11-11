/*
 * Класс обработки событий, связанных с кнопками приглашения и отправки картинки на стену пользователя
 * 
 * Copyright © 2011 Hexonxons
 *  
 */	

// класс обработчика
function FuncButtonClass()
{
	// div всей таблицы рейтинга
	var FuncButmainDiv = document.getElementById('fbuttons');
	var InviteFriendsDiv;
	var PostPictureDiv;
/*
 * Приватные методы
 */		
	// инициализация таблицы рейтинга
	var InitButtons = function()
	{
		var FButtonsDiv = document.getElementById('fbuttons');
		FButtonsDiv.innerHTML  = "\
			<div id= 'InviteFriends' class='Btn-container' style='right: 25px'>\
				<div>\
					<div class='Btn-1'></div>\
					<div class='Btn-2'></div>\
					<div class='Btn-3'></div>\
					<div class='Btn-4'></div>\
					<div class='Btn-4'></div>\
				</div>\
				<div class='Btn-content'>\
					<img src='./pictures/InviteFriends.png' style='width: 60px'>\
				</div>\
				<div>\
					<div class='Btn-4'> </div>\
					<div class='Btn-4'> </div>\
					<div class='Btn-3'> </div>\
					<div class='Btn-2'> </div>\
					<div class='Btn-1'> </div>\
				</div>\
				<div class='Caption'>\
					Invite Friends\
				</div>\
			</div>\
			<div id= 'PostPicture' class='Btn-container' style='left: 25px'>\
				<div>\
					<div class='Btn-1'></div>\
					<div class='Btn-2'></div>\
					<div class='Btn-3'></div>\
					<div class='Btn-4'></div>\
					<div class='Btn-4'></div>\
				</div>\
				<div class='Btn-content'>\
					<img src='./pictures/PostPicture.png' style='width: 60px'>\
				</div>\
				<div>\
					<div class='Btn-4'> </div>\
					<div class='Btn-4'> </div>\
					<div class='Btn-3'> </div>\
					<div class='Btn-2'> </div>\
					<div class='Btn-1'> </div>\
				</div>\
				<div class='Caption'>\
					Post Picture\
				</div>\
			</div>";
	}
	
	// выделение div при наведении курсора
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку кнопки
	var MouseOver = function(obj)
	{
		if(obj.children[1].style.background != "rgb(184, 184, 151)")
		{
			// закрашиваем кнопку
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
	// ---	obj - div, включающий в себя всю яйчейку кнопки
	var MouseOut = function(obj)
	{
		if(obj.children[1].style.background != "rgb(184, 184, 151)")
		{
			// закрашиваем кнопку
			for(var i = 0; i < 5; ++i)
			{
				obj.children[0].children[i].style.background = 'E0E0A8';
				obj.children[2].children[i].style.background = 'E0E0A8';
			}
			obj.children[1].style.background = 'E0E0A8';
		}
	}
	
	// функция обработки нажатия кнопки
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку кнопки
	var MouseClick = function(obj)
	{		
		// закрашиваем кнопку
		for(var i = 0; i < 5; ++i)
		{
			obj.children[0].children[i].style.background = 'B8B897';
			obj.children[2].children[i].style.background = 'B8B897';
		}
		obj.children[1].style.background = 'B8B897';
		
		if(obj.id == 'PostPicture')
			PostPicture();
		else
			Invite();
			
		// открашиваем кнопку =)
		for(var i = 0; i < 5; ++i)
		{
			obj.children[0].children[i].style.background = 'D6D6A9';
			obj.children[2].children[i].style.background = 'D6D6A9';
		}
		obj.children[1].style.background = 'D6D6A9';
	}

/*
 * Основная часть конструктора
 */	
 
	// инициализируем сами div`ы кнопок
	InitButtons();
	InviteFriendsDiv = document.getElementById('InviteFriends');
	PostPictureDiv = document.getElementById('PostPicture');
	// навешиваем обработчики
	$(InviteFriendsDiv).mouseover(function(){
		MouseOver(this);
	});
	$(InviteFriendsDiv).mouseout(function(){
		MouseOut(this);
	});
	$(InviteFriendsDiv).click(function(){
		MouseClick(this);
	});

	$(PostPictureDiv).mouseover(function(){
		MouseOver(this);
	});
	$(PostPictureDiv).mouseout(function(){
		MouseOut(this);
	});
	$(PostPictureDiv).click(function(){
		MouseClick(this);
	});
}	
