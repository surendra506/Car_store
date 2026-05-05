/**
 * Mixin for Magento_PageBuilder/js/widget/video-background
 *
 * Problem: Jarallax sets z-index:-100 on its container. In our full-bleed
 * slider CSS (100vh + transforms from Slick), this creates a stacking
 * context where z-index:-100 renders behind the parent's background paint.
 *
 * Fix: After Jarallax initializes, immediately patch the container's z-index
 * from -100 to 0. Also set the wrapper's background to transparent so the
 * Jarallax content is visible through it.
 */
define(['jquery'], function ($) {
    'use strict';

    return function (originalWidget) {
        return function (config, element) {
            var $element = $(element);

            // Call the original widget (Jarallax init happens here)
            originalWidget(config, element);

            // After original init, patch Jarallax's z-index and background
            var el = $element[0];
            if (el && el.jarallax && el.jarallax.image && el.jarallax.image.$container) {
                // Force z-index from -100 to 0
                el.jarallax.image.$container.style.setProperty('z-index', '0', 'important');
            }

            // Ensure the wrapper background is transparent for video slides
            if ($element.data('background-type') === 'video') {
                el.style.setProperty('background-color', 'transparent', 'important');
            }

            // Re-patch on every Jarallax coverImage/onScroll call
            // (Jarallax recalculates dimensions, we need z-index to stay at 0)
            if (el && el.jarallax) {
                var originalCoverImage = el.jarallax.coverImage;
                if (originalCoverImage) {
                    el.jarallax.coverImage = function () {
                        var result = originalCoverImage.apply(this, arguments);
                        if (this.image && this.image.$container) {
                            this.image.$container.style.setProperty('z-index', '0', 'important');
                        }
                        return result;
                    };
                }
            }
        };
    };
});
