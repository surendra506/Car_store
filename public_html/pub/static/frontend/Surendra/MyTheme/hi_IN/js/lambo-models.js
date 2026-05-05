/**
 * Lamborghini Models – Dynamic UI Enhancements
 *
 * Restructures DOM so layout becomes:
 *   [data-element="empty_link"]
 *     ├── .lambo-models__text   (model name + headline – ABOVE car)
 *     ├── .pagebuilder-slide-wrapper  (car bg image – MIDDLE)
 *     └── .lambo-models__buttons (CTA buttons – BELOW car)
 *
 * Also injects:
 *   - "MODELS / DISCOVER ALL MODELS" header bar
 *   - Left/Right navigation arrows
 *   - Model-name labels on slick dots
 */
define(['jquery'], function ($) {
    'use strict';

    var MODEL_NAMES = ['TEMERARIO', 'HURACÁN', 'REVUELTO', 'URUS'];

    function getSlider() {
        return $('.pagebuilder-slider.lamborginimodels');
    }

    function getRow() {
        var $slider = getSlider();
        if (!$slider.length) return $();
        return $slider.closest('[data-content-type="row"]');
    }

    /* ── 1. Header bar ─────────────────────────────────────────── */
    function injectHeader() {
        var $row = getRow();
        if (!$row.length || $row.find('.lambo-models-header').length) return;

        var html =
            '<div class="lambo-models-header">' +
            '<h2 class="lambo-models-header__title">Models</h2>' +
            '<a class="lambo-models-header__link" href="#">Discover all models</a>' +
            '</div>';

        $row.prepend(html);
    }

    /* ── 2. Navigation arrows (placed on parent .model row) ─────── */
    function injectArrows() {
        var $slider = getSlider();
        var $row = getRow();
        if (!$slider.length || !$row.length) return;
        if ($row.find('.lambo-models__arrow').length) return;

        var prevBtn =
            '<button type="button" class="lambo-models__arrow lambo-models__arrow--prev" aria-label="Previous">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="15 18 9 12 15 6"/></svg>' +
            '</button>';

        var nextBtn =
            '<button type="button" class="lambo-models__arrow lambo-models__arrow--next" aria-label="Next">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 6 15 12 9 18"/></svg>' +
            '</button>';

        $row.append(prevBtn);
        $row.append(nextBtn);

        $row.find('.lambo-models__arrow--prev').on('click', function () {
            try { $slider.slick('slickPrev'); } catch (e) { }
        });

        $row.find('.lambo-models__arrow--next').on('click', function () {
            try { $slider.slick('slickNext'); } catch (e) { }
        });
    }

    /* ── 3. Create custom model tabs (replaces slick dots entirely) ── */
    function createModelTabs() {
        var $slider = getSlider();
        var $row = getRow();
        if (!$slider.length || !$row.length) return;

        /* Already created? */
        if ($row.find('.lambo-models__tabs').length) return;

        /* Hide slick dots completely */
        $slider.find('.slick-dots').css('display', 'none');

        /* Build custom tabs */
        var html = '<div class="lambo-models__tabs"><div class="lambo-models__tabs-inner">';
        for (var i = 0; i < MODEL_NAMES.length; i++) {
            var activeClass = (i === 0) ? ' lambo-tab--active' : '';
            html += '<button type="button" class="lambo-tab' + activeClass + '" data-slide-index="' + i + '">' +
                MODEL_NAMES[i] +
                '</button>';
        }
        html += '</div></div>';

        /* Place after slider */
        $slider.after(html);

        /* Click handler */
        $row.find('.lambo-tab').on('click', function () {
            var index = parseInt($(this).attr('data-slide-index'), 10);
            try { $slider.slick('slickGoTo', index); } catch (e) { }
        });

        /* Update active on slide change */
        $slider.on('afterChange', function (event, slick, currentSlide) {
            $row.find('.lambo-tab').removeClass('lambo-tab--active');
            $row.find('.lambo-tab[data-slide-index="' + currentSlide + '"]').addClass('lambo-tab--active');
        });
    }

    /* Also hide slick dots if they reappear */
    function hideSlickDots() {
        var $slider = getSlider();
        $slider.find('.slick-dots').css('display', 'none');
    }
    function restructureSlides() {
        var $slider = getSlider();

        $slider.find('[data-content-type="slide"]').each(function () {
            var $slide = $(this);

            /* Skip if already restructured */
            if ($slide.data('restructured')) return;

            var $emptyLink = $slide.find('[data-element="empty_link"]');
            if (!$emptyLink.length) $emptyLink = $slide.children().first();

            var $wrapper = $emptyLink.find('.pagebuilder-slide-wrapper');
            var $content = $emptyLink.find('[data-element="content"]');
            var $existingBtn = $emptyLink.find('.pagebuilder-button-primary');

            if (!$wrapper.length) return;

            /* A) Create text block ABOVE the car */
            if ($content.length && !$emptyLink.find('.lambo-models__text').length) {
                var $textBlock = $('<div class="lambo-models__text"></div>');
                $textBlock.append($content.clone());
                $wrapper.before($textBlock);
                /* Hide original content inside overlay */
                $content.css('display', 'none');
            }

            /* B) Create buttons block BELOW the car */
            if ($existingBtn.length && !$emptyLink.find('.lambo-models__buttons').length) {
                var $btnContainer = $('<div class="lambo-models__buttons"></div>');

                /* Clone primary button */
                var $primaryBtn = $existingBtn.clone();
                $btnContainer.append($primaryBtn);

                /* Add secondary button */
                var secondary =
                    '<button type="button" class="lambo-btn--secondary">' +
                    'Download Brochure &nbsp;&#8595;' +
                    '</button>';
                $btnContainer.append(secondary);

                $wrapper.after($btnContainer);

                /* Hide original button */
                $existingBtn.css('display', 'none');
            }

            $slide.data('restructured', true);
        });

        /* Also handle slick cloned slides */
        $slider.find('.slick-cloned [data-element="content"]').css('display', 'none');
        $slider.find('.slick-cloned .pagebuilder-button-primary').css('display', 'none');
    }


    /* ── Boot sequence ─────────────────────────────────────────── */
    function boot() {
        var $slider = getSlider();
        if (!$slider.length) return;

        injectHeader();

        function enhance() {
            if (!$slider.hasClass('slick-initialized')) return false;

            /* Enable infinite loop so arrows cycle through all models */
            try {
                $slider.slick('slickSetOption', 'infinite', true, true);
            } catch (e) { }

            injectArrows();
            restructureSlides();
            hideSlickDots();
            createModelTabs();

            /* Retry to catch async slick refreshes */
            var retries = 0;
            var retryTimer = setInterval(function () {
                retries++;
                hideSlickDots();
                restructureSlides();
                if (retries >= 10) clearInterval(retryTimer);
            }, 300);

            return true;
        }

        if (enhance()) return;

        var tries = 0;
        var timer = setInterval(function () {
            tries++;
            if (enhance() || tries >= 50) {
                clearInterval(timer);
            }
        }, 200);

        $slider.on('afterChange reInit', function () {
            restructureSlides();
            hideSlickDots();
        });
    }

    $(boot);
});
