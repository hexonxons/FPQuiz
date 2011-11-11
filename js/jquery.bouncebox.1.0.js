(function($){
	
	/* Плагин добавляет к ядру jQuery Core четыре метода */
	
	/* Преобразование элемента в выпадающее окно: */
	$.fn.bounceBox = function(){
		
		/*
			Применение некоторых правил CSS, которые центрируют элемент в середине страницы
			и перемещают его выше области видимости браузера.
		*/
		
		this.css({
			top			: -this.outerHeight(),
			marginLeft	: -this.outerWidth()/2,
			position	: 'absolute',
			left		: '36.5%'
		});
		
		return this;
	}
	
	/* Метод boxShow */
	$.fn.bounceBoxShow = function(){
		
		/* Запуск анимации выпадения окна */
		
		this.stop().animate({top:200}/*,{easing:'easeOutBounce'}*/);
		this.data('bounceShown',true);
		return this;
	}
	
	/* Метод boxHide */
	$.fn.bounceBoxHide = function(){
		
		/* Запуск анимации поднимания окна */
		
		this.stop().animate({top:-this.outerHeight()});
		this.data('bounceShown',false);
		return this;
	}
	
	/* Метод boxToggle */
	$.fn.bounceBoxToggle = function(){
		
		/* 
			Показываем или скрываем bounceBox в зависимости от значения
			переменной 'bounceShown'
		*/
		
		if(this.data('bounceShown'))
			this.bounceBoxHide();
		else
			this.bounceBoxShow();
		
		return this;
	}
	
})(jQuery);
