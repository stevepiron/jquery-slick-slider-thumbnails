# slider-thumbnails
A jQuery plugin created with the purpose of creating a list of thumbnails for an existing slider. Built to be used with Slick &lt;https://github.com/kenwheeler/slick> but should work with any list of images.

## Settings
Option | Type | Default | Description
------ | ---- | ------- | -----------
thumbnailsListClass | string | 'js-slider-thumbnails__list' | The class to be applied on the list of thumbnails.
thumbnailItemClass | string | 'js-slider-thumbnails__item' | The class to be applied on each list item.
thumbnailClass | string | 'js-slider-thumbnails__img' | The class to be applied on each thumbnail.
slideSelector | string (selector) | '.slick-slide:not(.slick-cloned)' | A selector for the existing slides.
slideIndexDataAttr | string (data-attribute) | 'slick-index' | The data attribute used to define the index of each slide.
bgImgElSelector | string (selector) | false | If the slider uses background images, define the selector to target the elements on which the background images are applied.

### Dependencies
jQuery

### License
Copyright © Steve Piron
