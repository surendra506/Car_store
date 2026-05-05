define(['jquery'], function ($) {
    'use strict';

    $(function () {
        // For TilesTheme custom search template:
        // - click icon => toggle search open/close
        // For default Magento search button:
        // - first click opens (prevents submit)
        // - second click submits (when already open)
        $(document).on('click', '.block-search.custom-search .search-icon', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const parent = $(this).closest('.block-search');
            parent.toggleClass('active');

            if (parent.hasClass('active')) {
                parent.find('input').first().trigger('focus');
            }
        });

        $(document).on('click', '.block-search .action.search', function (e) {
            const parent = $(this).closest('.block-search');

            if (!parent.hasClass('active')) {
                e.preventDefault();
                e.stopPropagation();
                parent.addClass('active');
                parent.find('input').first().trigger('focus');
            }
        });

        // CLOSE ON OUTSIDE CLICK
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.block-search').length) {
                $('.block-search').removeClass('active');
            }
        });

        // CLOSE ON ESC
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                $('.block-search').removeClass('active');
            }
        });
    });
});
