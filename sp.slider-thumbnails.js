/**!
 * @author Steve Piron <https://twitter.com/stevepiron>
 * @requires jQuery
 *
 * A jQuery plugin created with the purpose of creating a list of thumbnails for
 * an existing slider. Built to be used with
 * Slick <https://github.com/kenwheeler/slick> but should work with any list
 * of images.
 */
(function( $ ) {

    var defaults;
    var params;

    // ====================================================================== //
    // Functions
    // ====================================================================== //

    /**
     * @function `unquote`
     *
     * Returns a given string, unquoted.
     *
     * @param string {string} - the string to unquote.
     */
    function unquote( string ) {
        return string.replace(/['`"‘’“”]+/g, '');
    }

    /**
     * @function `returnCSSUrl`
     *
     * Returns the url from a CSS asset link `url()`.
     *
     * @param cssAssetLink {string} - the string used to link an asset in CSS.
     *
     * 1. Exclude the first 4 characters `url(`
     * 2. Exclude the last character `)`
     */
    function returnCSSUrl( cssAssetLink ) {
        var url = cssAssetLink.substring(4, /* [1] */
            cssAssetLink.length - 1); /* [2] */
        return unquote(url);
    }

    /**
     * @function `createSlideThumbnails`
     *
     * Create thumbnails of all the slides. We can use the same size of images
     * used for the slides (they're already there) and we will scale them down
     * using CSS.
     *
     * @param $typeOfSlider {jQuery} - a collection of sliders of the same type
     */
    function createSlideThumbnails( $typeOfSlider ) {
        var thumbnailsList = '<ul class="'+params.thumbnailsListClass+'"></ul>';
        var $thumbnailsList = $(thumbnailsList);
        $typeOfSlider.each(function(i, slider) {
            var $slider = $(slider);
            var $slides = $slider.find(params.slideSelector);
            if( !$slides.length ) {
                return;
            }
            $slider.append($thumbnailsList);
            for (var s = 0; s < $slides.length; s++) {
                var originalImgSrc;
                if( !params.bgImgElSelector ) {
                    originalImgSrc = $slides.eq(s).find('img').attr('src');
                }
                else {
                    var $originalImg = $slides.eq(s).find(params.bgImgElSelector);
                    var bgImg = $originalImg.css('backgroundImage');
                    var originalImgSrc = returnCSSUrl( bgImg );
                }
                var img = '<img class="'+params.thumbnailClass+'" src="'+originalImgSrc+'">';
                var thumbnail = '<li class="'+params.thumbnailItemClass+
                    '" data-'+params.slideIndexDataAttr+'="'+s+'">'+img+'</li>';
                var $thumbnail = $(thumbnail);
                $slider.find('.'+params.thumbnailsListClass).append($thumbnail);
            }
        });
    }

    // ====================================================================== //
    // Plugin
    // ====================================================================== //

    $.fn.spSliderThumbnails = function( options ) {

        /**
         * Note: using `return` keeps jQuery's chaining possibility
         */
        return this.each(function() {

            defaults = {
                thumbnailsListClass: 'js-slider-thumbnails__list',
                thumbnailItemClass: 'js-slider-thumbnails__item',
                thumbnailClass: 'js-slider-thumbnails__img',
                slideSelector: '.slick-slide:not(.slick-cloned)',
                slideIndexDataAttr: 'slide-index',
                bgImgElSelector: false
            };

            params = $.extend( defaults, options );

            createSlideThumbnails( $(this) );

        });
    };

}( jQuery ));
