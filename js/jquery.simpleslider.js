 /**
 * jQuery SimpleSlider Plugin
 * This jQuery plugin was created by Luke Scalf at MonkeyWrench (https://github.com/GetNinja/SimpleSlider)
 * @name jQuery SimpleSlider
 * @author 601am - http://www.monkeywrench.cc/
 * @version 0.1
 * @date February 5, 2012
 * @category jQuery plugin
 * @copyright (c) 2012 MonkeyWrench (monkeywrench.cc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($)
{
	/**
	 * SimpleSlider: Initialize Plugin
	 */
	$.fn.simpleSlider = function(options)
	{
		var options = $.extend({}, $.fn.simpleSlider.defaults, options);
		
		return this.each(function()
		{
			// Variables used for storing state information about each slider
			var slider           = $(this),
				current_image    = options.start,
				image_count      = $(slider).children('.images').children().length,
				time_out         = null;
				
			// Make sure starting image id is less than total image count and greater than 0
			if(current_image > image_count || current_image < 1) current_image = 1;
			
			// Set display: 'none' for all slides except starting slide
			$('.images > *', slider).css({display: 'none'});
			$('.images .' + options.slide_class + current_image, slider).css({display: 'inline'});
			
			// Initialize Slideshow
			setTimeout(play, options.play);
			
			/**
			 * SimpleSlider Function (play): Starts the slider
			 */
			function play()
			{
				next_image = current_image;
				
				if(next_image == image_count)
				{
					next_image = 0;
				}
				next_image++;
				
				goto_image(next_image);
				
				time_out = setTimeout(play, options.play);
			}
			
			/**
			 * SimpleSlider Function (pause): Pauses the timer on mouse over
			 */
			function pause()
			{
				clearTimeout(time_out);
			}
			
			/**
			 * SimpleSlider Function (goto_image): Animation handler
			 */
			function goto_image(image_id)
			{
				if(!image_id) return true;
				
				switch(options.effect)
				{
					case 'fade-in':
						$('.images .' + options.slide_class + image_id, slider).css({
							display: 'none',
							zIndex: 2
						}).fadeIn(options.transition, function()
						{
							$('.images .' + options.slide_class + current_image, slider).css({display: 'none'});
							$('.images .' + options.slide_class + image_id, slider).css({zIndex: 1});
							current_image = image_id;
						});
						break;
					case 'fade-out':
						$('.images .' + options.slide_class + current_image, slider).css({zIndex: 2});
						$('.images .' + options.slide_class + image_id, slider).css({display: 'inline', zIndex: 1});
						$('.images .' + options.slide_class + current_image, slider).fadeOut(options.transition, function()
						{
							current_image = image_id;
						});
						break;
					case 'cross-fade':
						$('.images .' + options.slide_class + current_image, slider).css({zIndex: 2});
						$('.images .' + options.slide_class + image_id, slider).css({display: 'inline', zIndex: 1});
						$('.images .' + options.slide_class + image_id, slider).fadeIn(options.transition);
						$('.images .' + options.slide_class + current_image, slider).fadeOut(options.transition, function()
						{
							current_image = image_id;
						});
						break;
					case 'no-effect':
					default:
						$('.images .' + options.slide_class + current_image, slider).hide();
						$('.images .' + options.slide_class + image_id, slider).show();
						current_image = image_id;
						break;
				}
			}
			
			/**
			 * Event Handlers: Handles pausing on slider hover, if enabled
			 */
			if(options.pause == true)
			{
				$('.images', slider).mouseover(function(e)
				{
					pause();
				});
				$('.images', slider).mouseleave( function(e)
				{
					play();
				});
			}
		});
	};
	
	
	/**
	 * SimpleSlider: Default Options
	 */
	$.fn.simpleSlider.defaults = {
		container: 'simple-slider',    // String, Class name for gallery container. Default is 'simple-slider'
		delay: 0,                      // Number, Determines time in milliseconds between slide transitions, Default 0
		effect: 'fade-in',             // String, Type of effect to use, Options are 'fade-in', 'fade-out', 'cross-fade', 'no-effect'
		pause: true,                   // Boolean, Determines whether or not to pause the slider on mouse over, Default true
		slide_class: 'image',          // String, Class name for slides, do not include the slide number here. Default 'image'
		start: 1,                      // Number, Determines which slide to start with, Default 1
		transition: 500,               // Number, Determines time in milliseconds the slide transitions will take, Default 500
	};
})(jQuery);