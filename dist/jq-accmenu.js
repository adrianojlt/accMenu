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

			plugin.build();

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
		classname1l 	: 'acc3level1link',
		classname2l		: 'acc3level2link',
		classname3l		: 'acc3level3link'
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

		build: function() {

			var settings = this.settings;

			var plugin = this.self;

			var processList = function(LIs,topLevel) {

				//console.log(topLevel,LIs);

				LIs.each(function(index) {

					var li = $(this);

					li.children().each(function(index) {

						if ( $(this).prop('tagName') === 'A' ) {

							//console.log(topLevel, li.children().size(), $(this));
							if ( li.children().size() === 1 ) $(this).css('cursor','pointer').css('color','blue');

							switch(topLevel) {
							    case 1:
							    	//console.log('first level',$(this));
							 		$(this).addClass( settings.classname1l ).addClass( settings.classname1l + '-theme-' + settings.theme );
							        break;
							    case 2:
							    	//console.log('secound level');
							    	$(this).addClass( settings.classname2l ).addClass( settings.classname2l + '-theme-' + settings.theme );
							        break;
							    case 3:
							    	//console.log('third level',$(this));
							 		$(this).addClass( settings.classname3l ).addClass( settings.classname3l + '-theme-' + settings.theme );
							    	//$(this).addClass( settings.classname3l );
							    default:
							    	// all other levels ...
							}
						}

						if ( $(this).prop('tagName') === 'UL' ) {

							var childrens = $(this).css("display","none").children();

							if ( topLevel === 1 ) childrens.wrapAll('<div class="' + 'menuBorder' + '" />');

							var innerLevel = topLevel + 1;

							childrens.each(function(index) {

								if (  $(this).prop('tagName') === 'LI' ) {
									processList($(this),innerLevel);
								}
							});
						}
					});
				});
			};

			processList(this.mainLI,1);
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