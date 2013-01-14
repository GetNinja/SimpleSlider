 /**
 * jQuery SimpleSlider Plugin
 * This jQuery plugin was created by Luke Scalf at MonkeyWrench (https://github.com/monkey-wrench/SimpleSlider)
 * @name jquery.simpleslider.js
 * @author Luke Scalf - http://www.monkeywrench.cc/
 * @version 0.2
 * @date January 8, 2012
 * @category jQuery plugin
 * @copyright (c) 2012-2013 MonkeyWrench (monkeywrench.cc)
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
            var slider           = $(this);
            var current_image    = options.start;
            var image_count      = $(slider).children('.images').children().length;
            var time_out         = null;

            // Make sure starting image id is less than total image count and greater than 0
            if (current_image > image_count || current_image < 1) {
                current_image = 1;
            }

            // Set display: 'none' for all slides except starting slide
            $('.images > *', slider).css({display: 'none'});
            $('.images .' + options.slide_class + current_image, slider).css({display: 'inline'});

            // Generate navigation, if enabled
            if (options.navigation == true) {
                generate_navigation();
            }

            // Initialize Slideshow
            time_out = setTimeout(play, options.delay);

            /**
             * SimpleSlider Function (play): Starts the slider
             */
            function play()
            {
                next_image = current_image;

                if (next_image == image_count) {
                    next_image = 0;
                }
                next_image++;
                
                goto_image(next_image);
                
                time_out = setTimeout(play, options.delay);
            }

            /**
             * SimpleSlider Function (pause): Pauses the timer on mouse over
             */
            function pause() {
                clearTimeout(time_out);
            }

            /**
             * SimpleSlider Function (generate_navigation): Generates Slide Navigation
             */
            function generate_navigation()
            {
                var navigation = '';
                for (i = 1; i <= image_count; i++) {
                    navigation += '<li id="image' + i + '"><a href="#">&nbsp;</a></li>';
                }
                $('.' + options.nav_container).html(navigation);
                $('#' + options.slide_class + current_image).addClass('active');
            }

            /**
             * SimpleSlider Function (update_navigation): Updates Slide Navigation
             */
            function update_navigation(new_image)
            {
                $('.' + options.nav_container + ' li').removeClass('active');
                $('#' + options.slide_class + new_image).addClass('active');
            }

            /**
             * SimpleSlider Function (goto_image): Animation handler
             */
            function goto_image(image_id)
            {
                if(!image_id) {
                	return true;
                }

                // Update navigation, if enabled
                if(options.navigation == true) {
                    update_navigation(image_id);
                }

                switch (options.effect) {
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
             * SimpleSlider Function (goto_image_restart): Goes to specified image, and restarts animation
             */
            function goto_image_restart(image_id)
            {
                if(!image_id) {
                    return true;
                }
                
                pause();
                goto_image(image_id);
                time_out = setTimeout(play, options.delay);
            }

            /**
             * Event Handlers: Handles pausing on slider hover, if enabled
             */
            if(options.pause == true) {
                $('.images', slider).mouseover(function(e)
                {
                    pause();
                });
                $('.images', slider).mouseleave(function(e)
                {
                    play();
                });
            }

            /**
             * Event Handlers: Handles click of slider navigation, if enabled
             */
            if(options.navigation == true) {
                $('.' + options.nav_container + ' li a').click(function(e)
                {
                    e.preventDefault();
                    
                    var new_image = $(this).parent().attr('id').replace('image', '');
                    goto_image_restart(new_image);
                });
            }
        });
    };

    /**
     * SimpleSlider: Default Options
     */
    $.fn.simpleSlider.defaults = {
        container: 'simple-slider',               // String, Class name for gallery container. Default is 'simple-slider'
        delay: 0,                                 // Number, Determines time in milliseconds between slide transitions, Default 0
        effect: 'fade-out',                       // String, Type of effect to use, Options are 'fade-in', 'fade-out', 'cross-fade', 'no-effect'
        navigation: false,                        // Boolean, Determines whether or not to have slide navigation circles, default false
        nav_container: 'slider-navigation',       // String, Class name for navigation container, default 'slider-navigation'
        pause: true,                              // Boolean, Determines whether or not to pause the slider on mouse over, Default true
        slide_class: 'image',                     // String, Class name for slides, do not include the slide number here. Default 'image'
        start: 1,                                 // Number, Determines which slide to start with, Default 1
        transition: 500,                          // Number, Determines time in milliseconds the slide transitions will take, Default 500
    };
})(jQuery);
