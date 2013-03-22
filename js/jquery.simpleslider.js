 /**
  * jQuery SimpleSlider Plugin
  * This jQuery plugin was created by Luke Scalf at MonkeyWrench (https://github.com/GetNinja/SimpleSlider)
  * @name jquery.simpleslider.js
  * @author Luke Scalf - http://www.monkeywrench.cc/
  * @version 1.0.0
  * @date March 21, 2013
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

;(function($) {
    /**
     * SimpleSlider: Object Instance
     */
    $.simpleSlider = function(el, options) {
        var slider  = $(el),
            options = $.extend({}, $.simpleSlider.defaults, options),
            newImage;

        // Store a reference to the slider object
        $.data(el, 'simpleSlider', slider);

        // Private Methods
        methods = {
            init: function() {
                slider.currentImage = options.start,
                slider.imageCount   = slider.children('.images').children().length,
                slider.nextImage    = slider.currentImage;

                // Make Sure starting image id is less than total image count and greater than 0)
                if (slider.currentImage > slider.imageCount || slider.currentImage < 1) {
                    slider.currentImage = 1;
                }

                // Set 'display: none' for all slides except starting slide
                $('.images > *', slider).css({ display: 'none' });
                $('.images .' + options.slideClass + slider.currentImage, slider).css({ display: 'inline' });

                // Generate navigation, if enabled
                if (options.navigation) {
                    methods.generateNavigation();
                }

                // Start Slideshow
                slider.timer = setTimeout(slider.play, options.delay);

                // Event Handlers: Handles click of slider navigation, if enabled
                if(options.navigation == true) {
                    $('.' + options.navContainer + ' li a', slider.parent()).bind('click', methods.navigationHandler);
                }
            },
            generateNavigation: function() {
                var navigation = '';
                for (i = 1; i <= slider.imageCount; i++) {
                    navigation += '<li id="'+options.slideClass+i+'"><a href="#">&nbsp;</a></li>';
                }
                $('.' + options.navContainer, slider.parent()).html(navigation);
                $('#' + options.slideClass + slider.currentImage, slider.parent()).addClass('active');
            },
            updateNavigation: function(imageId)
            {
                $('.' + options.navContainer + ' li', slider.parent()).removeClass('active');
                $('#' + options.slideClass + imageId).addClass('active');
            },
            navigationHandler: function(e) {
                e.preventDefault();

                newImage = $(this).parent().attr('id').replace('image', '');
                methods.gotoImageAndRestart(newImage);
            },
            gotoImage: function(imageId)
            {
                if(!imageId) return true;

                //alert(imageId);

                // Update navigation, if enabled
                if(options.navigation == true) {
                    methods.updateNavigation(imageId);
                }

                switch (options.effect) {
                    case 'fade-in':
                        $('.images .' + options.slideClass + imageId, slider).css({
                            display: 'none',
                            zIndex: 2
                        }).fadeIn(options.transition, function()
                        {
                            $('.images .' + options.slideClass + slider.currentImage, slider).css({display: 'none'});
                            $('.images .' + options.slideClass + imageId, slider).css({zIndex: 1});
                            slider.currentImage = imageId;
                        });
                        break;
                    case 'fade-out':
                        $('.images .' + options.slideClass + slider.currentImage, slider).css({zIndex: 2});
                        $('.images .' + options.slideClass + imageId, slider).css({display: 'inline', zIndex: 1});
                        $('.images .' + options.slideClass + slider.currentImage, slider).fadeOut(options.transition, function()
                        {
                            slider.currentImage = imageId;
                        });
                        break;
                    case 'cross-fade':
                        $('.images .' + options.slideClass + slider.currentImage, slider).css({zIndex: 2});
                        $('.images .' + options.slideClass + imageId, slider).css({display: 'inline', zIndex: 1});
                        $('.images .' + options.slideClass + imageId, slider).fadeIn(options.transition);
                        $('.images .' + options.slideClass + slider.currentImage, slider).fadeOut(options.transition, function()
                        {
                            slider.currentImage = imageId;
                        });
                        break;
                    case 'no-effect':
                    default:
                        $('.images .' + options.slideClass + slider.currentImage, slider).hide();
                        $('.images .' + options.slideClass + imageId, slider).show();
                        slider.currentImage = imageId;
                        break;
                }
            },
            gotoImageAndRestart: function(imageId)
            {
                if(!imageId) {
                    return true;
                }

                slider.pause();
                methods.gotoImage(imageId);
                slider.timer = setTimeout(slider.play, options.delay);
            }
        };

        // Public functions
        slider.play = function() {
            slider.nextImage = slider.currentImage;
            if (slider.nextImage == slider.imageCount) {
                slider.nextImage = 0;
            }
            slider.nextImage++;

            methods.gotoImage(slider.nextImage);

            slider.timer = setTimeout(slider.play, options.delay);
        }

        slider.pause = function() {
            clearTimeout(slider.timer);
            $('.'+options.navContainer, slider.parent()).fadeOut();
        }

        slider.resume = function() {
            $('.'+options.navContainer, slider.parent()).fadeIn();
            slider.play();
        }

        // Initialize the slider
        methods.init();
    }

    /**
     * SimpleSlider: Plugin Function
     */
    $.fn.simpleSlider = function(options) {
        if (options === undefined) options = {};

        if (typeof options === 'object') {
            return this.each(function() {
                var $this    = $(this),
                    selector = '.images > *',
                    $slides  = $this.find(selector);

                if ($slides.length > 1) {
                    new $.simpleSlider(this, options);
                }
            });
        } else {
            // Helper strings to quickly perform functions on the slider
            var $slider = $(this).data('simpleSlider');
            switch (options) {
                case 'play':
                    $slider.play();
                    break;
                case 'resume':
                    $slider.resume();
                    break;
                case 'pause':
                    $slider.pause();
                    break;
            }
        }
    };

    /**
     * SimpleSlider: Default Options
     */
    $.simpleSlider.defaults = {
        container:    'simple-slider',       // String, Class name for gallery container. Default is 'simple-slider'
        delay:        0,                     // Number, Determines time in milliseconds between slide transitions, Default 0
        effect:       'fade-out',            // String, Type of effect to use, Options are 'fade-in', 'fade-out', 'cross-fade', 'no-effect'
        navigation:   false,                 // Boolean, Determines whether or not to have slide navigation circles, default false
        navContainer: 'slider-navigation',   // String, Class name for navigation container, default 'slider-navigation'
        slideClass:   'image',               // String, Class name for slides, do not include the slide number here. Default 'image'
        start: 1,                            // Number, Determines which slide to start with, Default 1
        transition: 500,                     // Number, Determines time in milliseconds the slide transitions will take, Default 500
    };
})(jQuery);