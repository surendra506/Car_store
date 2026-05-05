/**
 * Configure Your Car – Lamborghini Configurator Section
 *
 * Enhances the PageBuilder slider (.configure-car) to match the
 * Lamborghini.com configurator section design:
 *   - Injects model-name TABS above the slider (TEMERARIO | REVUELTO | URUS SE)
 *   - Injects "EXPLORE THE MODEL →" secondary button beside the primary CTA
 *   - Injects bottom disclaimer text
 *   - Hides default slick dots (replaced by tabs)
 */
define(['jquery'], function ($) {
    'use strict';

    /* ── Model names — must match slide order in PageBuilder ──── */
    var MODEL_NAMES = ['TEMERARIO', 'REVUELTO', 'URUS SE'];

    function getSlider() {
        return $('.pagebuilder-slider.configure-car');
    }

    function getRow() {
        var $slider = getSlider();
        if (!$slider.length) return $();
        return $slider.closest('[data-content-type="row"]');
    }

    /* ── 1. MODEL TABS — top navigation ──────────────────────── */
    function createTabs() {
        var $slider = getSlider();
        var $row = getRow();
        if (!$slider.length || !$row.length) return;
        if ($row.find('.configure-car__tabs').length) return;

        /* Hide slick dots */
        $slider.find('.slick-dots').css('display', 'none');

        var html = '<div class="configure-car__tabs"><div class="configure-car__tabs-inner">';
        for (var i = 0; i < MODEL_NAMES.length; i++) {
            var activeClass = (i === 0) ? ' configure-tab--active' : '';
            html += '<button type="button" class="configure-tab' + activeClass + '" data-slide-index="' + i + '">' +
                MODEL_NAMES[i] +
                '</button>';
        }
        html += '</div></div>';

        /* Place BEFORE the slider (tabs appear at top of section) */
        $slider.before(html);

        /* Tab click → go to slide */
        $row.find('.configure-tab').on('click', function () {
            var index = parseInt($(this).attr('data-slide-index'), 10);
            try { $slider.slick('slickGoTo', index); } catch (e) { }
        });

        /* Update active tab on slide change */
        $slider.on('afterChange', function (event, slick, currentSlide) {
            $row.find('.configure-tab').removeClass('configure-tab--active');
            $row.find('.configure-tab[data-slide-index="' + currentSlide + '"]').addClass('configure-tab--active');
        });
    }

    /* ── 2. INJECT SECONDARY BUTTON beside the original primary ─── */
    function injectButtons() {
        var $slider = getSlider();
        if (!$slider.length) return;

        $slider.find('[data-content-type="slide"]').each(function () {
            var $slide = $(this);
            if ($slide.data('configure-enhanced')) return;

            var $posterContent = $slide.find('.pagebuilder-poster-content');
            var $primaryBtn = $posterContent.find('.pagebuilder-button-primary').first();

            if ($primaryBtn.length && !$posterContent.find('.configure-car__buttons').length) {
                /* Create button container */
                var $btnWrap = $('<div class="configure-car__buttons"></div>');

                /* Move the ORIGINAL primary button into the container (not clone) */
                $primaryBtn.before($btnWrap);
                $btnWrap.append($primaryBtn);

                /* Add secondary "EXPLORE THE MODEL" button */
                var secondaryBtn =
                    '<button type="button" class="configure-btn--secondary">' +
                    'Explore the Model &nbsp;&#8594;' +
                    '</button>';
                $btnWrap.append(secondaryBtn);
            }

            $slide.data('configure-enhanced', true);
        });
    }

    /* ── 3. INJECT DISCLAIMER TEXT ────────────────────────────── */
    function injectDisclaimer() {
        var $row = getRow();
        if (!$row.length || $row.find('.configure-car__disclaimer').length) return;

        var text = '<div class="configure-car__disclaimer">' +
            'Energy consumption (weighted combined): 4,3 kWh/100 Km plus 11,2 l/100km; ' +
            'CO2 emissions (weighted combined): 272 g/km; CO2 class (weighted combined): G; ' +
            'CO2 class with discharged battery: G; Fuel consumption with discharged battery (combined): 14 l/100km' +
            '</div>';

        $row.append(text);
    }

    /* ── 4. HIDE SLICK DOTS ──────────────────────────────────── */
    function hideSlickDots() {
        getSlider().find('.slick-dots').css('display', 'none');
    }

    /* ── Boot ─────────────────────────────────────────────────── */
    function boot() {
        var $slider = getSlider();
        if (!$slider.length) return;

        function enhance() {
            if (!$slider.hasClass('slick-initialized')) return false;

            /* Force dark bg on parent row */
            var $row = getRow();
            if ($row.length) {
                $row.addClass('configure-car-row');
            }

            createTabs();
            injectButtons();
            injectDisclaimer();
            hideSlickDots();

            /* Retry for async slick refreshes */
            var retries = 0;
            var retryTimer = setInterval(function () {
                retries++;
                hideSlickDots();
                injectButtons();
                if (retries >= 10) clearInterval(retryTimer);
            }, 300);

            return true;
        }

        if (enhance()) return;

        /* Poll until slick initializes */
        var tries = 0;
        var timer = setInterval(function () {
            tries++;
            if (enhance() || tries >= 50) {
                clearInterval(timer);
            }
        }, 200);

        $slider.on('afterChange reInit', function () {
            injectButtons();
            hideSlickDots();
        });
    }

    $(boot);
});
