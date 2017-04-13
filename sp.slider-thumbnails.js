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
     * @function `createAndCollectThumbnail`
     *
     * @param thumbnailsArr {array} - the collection of thumbnails.
     * @param $slider {jQuery} - the related slider.
     * @param src {string} - the source of the thumbnail.
     * @param index {integer} - the index of the thumbnail.
     *
     * 1. Keep the thumbnail in an object that will automatically sort them as
     *    we use the index of the thumbnail as key.
     */
    function createAndCollectThumbnail( thumbnailsArr, $slider, src, index ) {
        var img = '<img class="'+params.thumbnailClass+'" src="'+src+'">';
        var thumbnail = '<li class="'+params.thumbnailItemClass+
            '" data-'+params.slideIndexDataAttr+'="'+index+'">'+img+'</li>';
        var $thumbnail = $(thumbnail);
        thumbnailsArr[index] = $thumbnail; /* [1] */
    }

    /**
     * @function `outputAllThumbnails`
     *
     * Output thumbnails, only if all of them have been collected.
     *
     * @param thumbnailsArr {array} - the collection of thumbnails.
     * @param totalThumbsCount {integer} - the number of thumbnails to collect.
     * @param $slider {jQuery} - the related slider.
     *
     * 1. Quick escape if all thumbnails have not been collected yet.
     */
    function outputAllThumbnails( thumbnailsArr, totalThumbsCount, $slider ) {
        if( thumbnailsArr.length < totalThumbsCount ) {
            return; /* [1] */
        }
        var $thumbnailList = $slider.find('.'+params.thumbnailsListClass);
        for( var t = 0; t < totalThumbsCount; t++ ) {
            $thumbnailList.append(thumbnailsArr[t]);
        }
    }

    /**
     * @function `createSlideThumbnails`
     *
     * Create thumbnails of all the slides. We can use the same size of images
     * used for the slides (they're already there) and we will scale them down
     * using CSS.
     *
     * @param $typeOfSlider {jQuery} - a collection of sliders of the same type.
     *
     * 1. Store the loop index for this thumbnail as a data attribute as we'll
     *    be waiting for the image the image to load to execute further code and
     *    thus won't be able to rely on the loop index.
     * 2. Unbind the load event, as it might get fired again on resize when
     *    a higher resolution image is loaded.
     */
    function createSlideThumbnails( $typeOfSlider ) {
        var thumbnailsList = '<ul class="'+params.thumbnailsListClass+'"></ul>';
        var $thumbnailsList = $(thumbnailsList);
        $typeOfSlider.each(function(i, slider) {
            var $slider = $(slider);
            var $slides = $slider.find(params.slideSelector);
            var slidesCount = $slides.length;
            if( !slidesCount ) {
                return;
            }
            $slider.append($thumbnailsList);
            for (var s = 0; s < slidesCount; s++) {
                var originalImgSrc;
                var thumbnails = {};
                if( !params.bgImgElSelector ) {
                    var $originalImg = $slides.eq(s).find('img')
                        .data('thumb-index', s); /* [1] */
                    $originalImg.on('load', function() {
                        originalImgSrc = $(this).attr('src');
                        var index = $(this).data('thumb-index');
                        createAndCollectThumbnail(thumbnails, $slider,
                            originalImgSrc, index);
                        outputAllThumbnails(thumbnails, slidesCount, $slider);
                        $(this).unbind('load'); /* [2] */
                    });
                }
                else {
                    var $originalImg = $slides.eq(s).find(params.bgImgElSelector);
                    var bgImg = $originalImg.css('backgroundImage');
                    originalImgSrc = returnCSSUrl( bgImg );
                    createAndCollectThumbnail(thumbnails, $slider,
                        originalImgSrc, s);
                    outputAllThumbnails(thumbnails, slidesCount, $slider);
                }

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
