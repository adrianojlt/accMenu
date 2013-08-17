// Utility ...
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

// keep all your code in a Clousure ...
;(function( $ , window , document , undefined ) {

	// change the name of this plugin here ...
	var pluginName = 'accMenu';

	/**
	 * This is where we register our plugin within jQuery plugin
	 */	
	$.fn[pluginName] = function(settings) {

		if ( typeof settings === 'string') {} // ... settings passed as string
		else { } // ... object was passed 

		// ... merge settings
		settings = $.extend({}, $.fn[pluginName].defaultSettings, settings);

		// keep jquery method chaining ...
		return this.each(function(){

			var plugin = Object.create( Plugin );

			plugin.init(settings, this);

			plugin.tmp();

			plugin.setList();

			plugin.mainLinksEvent();
		});
	}

	/**
	 * Provide Default Settings in a variavel that can itself be modified before intallation.
	 * This way its possible to change the settings as a whole rather than having to pass modified
	 * values each time we instantiate our plugin.
	 */
	$.fn[pluginName].defaultSettings = {
		opt1			: 'val1',
		opt2			: 'val2',
		opt3			: 'val3',
		theme			: 'original',
		autohide		: true,
		slideSpeed		: 500,
		event			: 'click',
		classname1l 	: 'acc3mainlink',
		classname2l		: 'acc3sublink',
		classname3l		: 'acc3subsublink'
	};

	var Plugin = {

		init: function(settings, elem) {

			// reference to the plugin object
			this.self = this;

			// selected element
			this.elem = elem;

			// jQuery obj of the selected element
			this.$elem = $(this.elem);

			// global settings
			this.settings = settings;

			this.mainLI = this.$elem.children('li');
		},

		setList: function() {

			var settings = this.settings;

			this.mainLI.each(function(index) {

				// add class name to 1nd level anchor
				$(this).children('a')
					.addClass(settings.classname1l)
					.addClass( settings.classname1l + '-theme-' + settings.theme);

				var ul = $(this).children('ul');
				ul.css("display","none");

				var childrenLI = ul.children();
				childrenLI.wrapAll('<div class="' + 'menuBorder' + '" />');

				$.each(childrenLI, function(key, value) {

					// add class name to 2nd level anchor
					$(this).children('a')
						.addClass( settings.classname2l )
						.addClass( settings.classname2l + '-theme-' + settings.theme );

					// add class name to 3nd level anchor
					$(this).children('ul').css({display: "none"})
						.each(function(index) {
							$(this).children('li').children('a').addClass(settings.classname3l);
						});
				});
			});
		},

		mainLinksEvent: function() {

			var settings = this.settings;

			var plugin = this.self;

			this.mainLI.each(function(index) {

				$(this).children('a').bind(settings.event, function(evt) {

					evt.preventDefault();

					var ul = $(this).siblings();

					// menu entry with no childrens ...
					if ( ul.size() === 0 ) { return; }

					var visibleULs = $( '.' + settings.classname1l ).siblings('ul:visible');

					if ( ul.is(':visible')) 
						ul.slideUp(settings.slideSpeed);
					else {

						// hide visible main menu ...
						visibleULs.slideUp(settings.slideSpeed);

						// open clicked menu ...
						ul.slideDown(settings.slideSpeed);
					}

					// hide visible submenu entries inside the visible main menu ...
					visibleULs.children().find('ul:visible').slideUp(settings.slideSpeed);
				});

				plugin.subLinksEvent($(this));
			});
		},

		subLinksEvent: function(li) {

			var settings = this.settings;

			var subUL = li.children('ul');

			if ( subUL.size() === 0 ) return;

			var subMenuAnchors = subUL.children().children().children('a');

			subMenuAnchors.each(function(index) {
				
				var ul = $(this).siblings();

				if ( ul.size() === 0 ) return;

				$(this).bind('click', function() {

					if ( ul.is(':visible') )
						ul.slideUp(settings.slideSpeed);
					else {
						var visibleULs = ul.parent().parent().find('ul:visible');
						visibleULs.slideUp(settings.slideSpeed);
						ul.slideDown(settings.slideSpeed);
					}
				});
			});
		},

		tmp: function(arg) {

		}
	}
})( jQuery , window , document );