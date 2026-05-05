define(['jquery'], function ($) {
    'use strict';

    function setExpanded($btn, expanded) {
        $btn.attr('aria-expanded', expanded ? 'true' : 'false');
    }

    function closeNav($header) {
        const $nav = $header.find('#lambo-nav');
        const $btn = $header.find('.lambo-header__menu').first();

        if (!$nav.length || !$btn.length) {
            return;
        }

        $nav.prop('hidden', true);
        $header.removeClass('lambo-header--nav-open');
        $('body').removeClass('lambo-nav-open');
        setExpanded($btn, false);
    }

    function openNav($header) {
        const $nav = $header.find('#lambo-nav');
        const $btn = $header.find('.lambo-header__menu').first();

        if (!$nav.length || !$btn.length) {
            return;
        }

        $nav.prop('hidden', false);
        $header.addClass('lambo-header--nav-open');
        $('body').addClass('lambo-nav-open');
        setExpanded($btn, true);
    }

    function updateScrolled($header) {
        const isScrolled = window.scrollY > 10;
        $header.toggleClass('lambo-header--scrolled', isScrolled);
    }

    $(function () {
        const $header = $('[data-lambo-header]').first();
        if (!$header.length) {
            return;
        }

        updateScrolled($header);
        $(window).on('scroll', function () {
            updateScrolled($header);
        });

        $(document).on('click', '.lambo-header__menu', function (e) {
            e.preventDefault();

            if ($header.hasClass('lambo-header--nav-open')) {
                closeNav($header);
                return;
            }

            openNav($header);
        });

        $(document).on('click', function (e) {
            if (!$header.hasClass('lambo-header--nav-open')) {
                return;
            }

            if ($(e.target).closest('.lambo-header__menu, #lambo-nav').length) {
                return;
            }

            closeNav($header);
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                closeNav($header);
            }
        });

        $(document).on('click', '#lambo-nav a', function () {
            closeNav($header);
        });
    });
});

