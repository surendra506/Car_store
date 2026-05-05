define(['jquery'], function ($) {
    'use strict';

    function closeAll(except) {
        $('[data-lt-switcher].is-open').each(function () {
            if (except && this === except) {
                return;
            }
            $(this).removeClass('is-open')
                .find('.lt-switcher__btn')
                .attr('aria-expanded', 'false');
        });
    }

    function init() {
        $(document).on('click', '.lt-switcher__btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $switcher = $(this).closest('[data-lt-switcher]');
            var willOpen = !$switcher.hasClass('is-open');

            closeAll($switcher.get(0));
            $switcher.toggleClass('is-open', willOpen);
            $(this).attr('aria-expanded', willOpen ? 'true' : 'false');
        });

        $(document).on('click', function () {
            closeAll();
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                closeAll();
            }
        });

        $(document).on('click', '.lt-switcher__menu', function (e) {
            e.stopPropagation();
        });
    }

    return init;
});

