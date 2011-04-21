/** include plugin */
/** -------------------------------------------------------------------------------- */
/**
 * $.include - script inclusion jQuery plugin
 * Based on idea from http://www.gnucitizen.org/projects/jquery-include/
 * @author Tobiasz Cudnik
 * @link http://meta20.net/.include_script_inclusion_jQuery_plugin
 * @license MIT
 */
// overload jquery's onDomReady
if ( jQuery.browser.mozilla || jQuery.browser.opera ) {
	document.removeEventListener( "DOMContentLoaded", jQuery.ready, false );
	document.addEventListener( "DOMContentLoaded", function(){ jQuery.ready(); }, false );
}
jQuery.event.remove( window, "load", jQuery.ready );
jQuery.event.add( window, "load", function(){ jQuery.ready(); } );
jQuery.extend({
	includeStates: {},
	include: function(url, callback, dependency){
		if ( typeof callback != 'function' && ! dependency ) {
			dependency = callback;
			callback = null;
		}
		url = url.replace('\n', '');
		jQuery.includeStates[url] = false;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = function () {
			jQuery.includeStates[url] = true;
			if ( callback )
				callback.call(script);
		};
		script.onreadystatechange = function () {
			if ( this.readyState != "complete" && this.readyState != "loaded" ) return;
			jQuery.includeStates[url] = true;
			if ( callback )
				callback.call(script);
		};
		script.src = url;
		if ( dependency ) {
			if ( dependency.constructor != Array )
				dependency = [dependency];
			setTimeout(function(){
				var valid = true;
				$.each(dependency, function(k, v){
					if (! v() ) {
						valid = false;
						return false;
					}
				})
				if ( valid )
					document.getElementsByTagName('head')[0].appendChild(script);
				else
					setTimeout(arguments.callee, 10);
			}, 10);
		}
		else
			document.getElementsByTagName('head')[0].appendChild(script);
		return function(){
			return jQuery.includeStates[url];
		}
	},
	readyOld: jQuery.ready,
	ready: function () {
		if (jQuery.isReady) return;
		imReady = true;
		$.each(jQuery.includeStates, function(url, state) {
			if (! state)
				return imReady = false;
		});
		if (imReady) {
			jQuery.readyOld.apply(jQuery, arguments);
		} else {
			setTimeout(arguments.callee, 10);
		}
	}
});

/** jquery_gmap plugin */
/** -------------------------------------------------------------------------------- */

(function( $ ) {
	$.include('http://maps.google.com/maps/api/js?sensor=false');
	var methods = {
		init: function(options){
			
			var settings = {
				clickable : true,
				cursor		: undefined,
				draggable	: true,
				flat			: false,
				icon			: undefined,
				map				: undefined,
				position	: undefined,
				shadow		: undefined,
				shape			: undefined,
				title			: undefined,
				visible		: undefined,
				zIndex		: undefined,				
				lat				: undefined,
				lng				: undefined
			};
			
			options = ( options || {});
			$.extend( settings, options );
			
			return this.each( function(){
				var $this = $(this);
				var data = $this.data('gmap');
				
				if (!data){
					$this.data('gmap', {
					settings : settings
					});
				};
				
				var latlng = new google.maps.LatLng($this.data('gmap').settings.lat.val(), $this.data('gmap').settings.lng.val());
				
		    var myOptions = {
		      zoom: 8,
		      center: latlng,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };
		
				var map = new google.maps.Map($this[0], myOptions);
				
				var marker = new google.maps.Marker({
								clickable : $this.data('gmap').settings.clickable,
								cursor		: $this.data('gmap').settings.cursor,
								draggable	: $this.data('gmap').settings.draggable,
								flat			: $this.data('gmap').settings.flat,
								icon			: $this.data('gmap').settings.icon,
								map				: map,
								position	: latlng,
								shadow		: $this.data('gmap').settings.shadow,
								shape			: $this.data('gmap').settings.shape,
								title			: $this.data('gmap').settings.title,
								visible		: $this.data('gmap').settings.visible,
								zIndex		: $this.data('gmap').settings.zIndex
				    });

				google.maps.event.addListener(marker, 'dragend', function(latlng){
						$this.data('gmap').settings.lat.val(latlng.latLng.lat());
						$this.data('gmap').settings.lng.val(latlng.latLng.lng());
					});
			});
		}
	};
	$.fn.gmap = function(method){
		if ( methods[method] ){
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}	else {
			$.error( 'Method ' + method + ' does not exist on jQuery.gmap')
		}
	};
})( jQuery );

