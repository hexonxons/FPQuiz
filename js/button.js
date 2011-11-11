/*
 * Класс создания кнопки и обработки событий, связанных с кнопками
 * 
 * Copyright © 2011 Hexonxons
 *  
 */	

// класс обработчика
function ButtonClass(ButtonId, 
					 Width, 
					 Height, 
					 MainColor, 
					 MouseOverColor, 
					 MouseClickColor, 
					 OnClickFunction, 
					 InnerButtonElementHtml, 
					 UnderText,
					 ExtCssPropForButtonDataDiv)
{
	var mMainButtonDiv;
	var mButtonId;
	var mWidth;
	var mHeight;
	var mMainColor;
	var mMouseOverColor;
	var mMouseClickColor;
	var mInnerButtonElementHtml;
	var mExtCssPropForButtonDataDiv;
	var mUnderText;
	
	var mOnClickFunction = {f:function(){}};
/*
 * Публичные методы
 */		
	this.SetInnerVal = function(innerVal)
	{
		mMainButtonDiv.children[1].innerHTML = innerVal;
	}
/*
 * Приватные методы
 */		
	// инициализация таблицы рейтинга
	var InitButton = function()
	{
		mMainButtonDiv = document.getElementById(mButtonId);
		mMainButtonDiv.innerHTML  = "\
				<div>\
					<div class='Btn-1'></div>\
					<div class='Btn-2'></div>\
					<div class='Btn-3'></div>\
					<div class='Btn-4'></div>\
					<div class='Btn-4'></div>\
				</div>\
				<div class='Btn-content'></div>\
				<div>\
					<div class='Btn-4'> </div>\
					<div class='Btn-4'> </div>\
					<div class='Btn-3'> </div>\
					<div class='Btn-2'> </div>\
					<div class='Btn-1'> </div>\
				</div>";
		if(mUnderText)
		{
			mMainButtonDiv.innerHTML += "<div class='Caption' style='width:" + mWidth +"'>" + mUnderText + "</div>";
		}
		
		mMainButtonDiv.style.cssText += "position: absolute; width: " + mWidth.toString();
		mMainButtonDiv.children[1].style.cssText += "height: " + (mHeight - 10).toString();
		mMainButtonDiv.children[1].style.cssText += ExtCssPropForButtonDataDiv;
		mMainButtonDiv.children[1].innerHTML = mInnerButtonElementHtml;
		SetColor(mMainColor);
	}
	
	// Задание цвета кнопки
	// IN:
	// ---	color - цвет
	var SetColor = function(color)
	{
		// закрашиваем кнопку
		for(var i = 0; i < 5; ++i)
		{
			mMainButtonDiv.children[0].children[i].style.background = color;
			mMainButtonDiv.children[2].children[i].style.background = color;
		}
		mMainButtonDiv.children[1].style.background = color;
	}
	
	
	var MouseOver = function(obj)
	{
		SetColor(mMouseOverColor);
	}
	
	// выделение div при наведении курсора
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку кнопки
	var MouseOut = function(obj)
	{
		SetColor(mMainColor);
	}
	
	// функция обработки нажатия кнопки
	// IN:
	// ---	obj - div, включающий в себя всю яйчейку кнопки
	var MouseClick = function(obj)
	{		
		SetColor(mMouseClickColor);
		
		mOnClickFunction(obj);
		
		SetColor(mMouseOverColor);
	}

/*
 * Основная часть конструктора
 */	
 
	mButtonId = ButtonId;
	mWidth = Width;
	mHeight = Height;
	mMainColor = MainColor;
	mMouseOverColor = MouseOverColor;
	mMouseClickColor = MouseClickColor;
	mOnClickFunction = OnClickFunction;
	mInnerButtonElementHtml = InnerButtonElementHtml;
	mUnderText = UnderText;
	mExtCssPropForButtonDataDiv = ExtCssPropForButtonDataDiv;
	InitButton();
	
	// навешиваем обработчики
	$(mMainButtonDiv).mouseover(function(){
		MouseOver(this);
	});
	$(mMainButtonDiv).mouseout(function(){
		MouseOut(this);
	});
	$(mMainButtonDiv).click(function(){
		MouseClick(this);
	});
}	

