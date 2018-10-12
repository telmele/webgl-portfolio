/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <HakunaMacouta> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Thomas Blanc
 * ----------------------------------------------------------------------------
 */

var modalOpened = document.getElementById('about');
var menuBtn = document.getElementById('btnMenu');
var menu = document.getElementById('menu');

menu.style.left = "-" + menu.offsetWidth + "px";

var menuOpened = false;
menuBtn.addEventListener('mousedown', function() {
	closeModal();
	if (menuOpened) {
		anime({targets : menu, translateX : 0, easing : 'easeInQuad'});
	} else {
		anime({targets : menu, translateX : menu.offsetWidth, easing : 'easeInQuad' });
	}
	menuOpened = !menuOpened;

});


/**
 *  Set modal class to close it
 */
function closeModal() {
	modalOpened.className = "modal";
	if(!isSmartphone) {
		console.log(isSmartphone);
		triggerGlitch();
	}
}

function openModal(el) {
	var html = document.getElementById(el.getAttribute("data-target"));
	anime({targets : menu, translateX : 0, easing : 'easeInQuad'});
	menuOpened = !menuOpened;
	closeModal();
	modalOpened = html;
	html.className += ' ' + 'is-active';
	if(!isSmartphone) {
		triggerGlitch();
	}
}

/**
 * Press escape to close active modal
 * @param evt event catched by js
 */
document.onkeydown = function(evt) {
	evt = evt || window.event;
	var isEscape = false;
	if ("key" in evt) {
		isEscape = (evt.key == "Escape" || evt.key == "Esc");
	} else {
		isEscape = (evt.keyCode == 27);
	}

	if (isEscape) {
		closeModal();
	}
};

/**
 *  String slider
 * @param el
 * @param toRotate
 * @param period
 * @constructor
 */
var TxtRotate = function(el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 10) || 2000;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};
/**
 *  String Slider
 */
TxtRotate.prototype.tick = function() {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
		this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
		this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

	var that = this;
	var delta = 300 - Math.random() * 100;

	if (this.isDeleting) { delta /= 2; }

	if (!this.isDeleting && this.txt === fullTxt) {
		delta = this.period;
		this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
		this.isDeleting = false;
		this.loopNum++;
		delta = 500;
	}

	setTimeout(function() {
		that.tick();
	}, delta);
};
/**
 *  String Slider
 */
window.onload = function() {
	var elements = document.getElementsByClassName('txt-rotate');
	for (var i=0; i<elements.length; i++) {
		var toRotate = elements[i].getAttribute('data-rotate');
		var period = elements[i].getAttribute('data-period');
		if (toRotate) {
			new TxtRotate(elements[i], JSON.parse(toRotate), period);
		}
	}
	// INJECT CSS
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
	document.body.appendChild(css);
};


var items = []
	, point = document.querySelector('svg').createSVGPoint();

function getCoordinates(e, svg) {
	point.x = e.clientX;
	point.y = e.clientY;
	return point.matrixTransform(svg.getScreenCTM().inverse());
}

function changeColor(e) {
	document.body.className = e.currentTarget.className;
}

function Item(config) {
	Object.keys(config).forEach(function (item) {
		this[item] = config[item];
	}, this);
	this.el.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
	this.el.addEventListener('touchmove', this.touchMoveHandler.bind(this));
}

Item.prototype = {
	update: function update(c) {
		this.clip.setAttribute('cx', c.x);
		this.clip.setAttribute('cy', c.y);
	},
	mouseMoveHandler: function mouseMoveHandler(e) {
		this.update(getCoordinates(e, this.svg));
	},
	touchMoveHandler: function touchMoveHandler(e) {
		e.preventDefault();
		var touch = e.targetTouches[0];
		if (touch) return this.update(getCoordinates(touch, this.svg));
	}
};

[].slice.call(document.querySelectorAll('.item'), 0).forEach(function (item, index) {
	items.push(new Item({
		el: item,
		svg: item.querySelector('svg'),
		clip: document.querySelector('#clip-'+index+' circle'),
	}));
});
