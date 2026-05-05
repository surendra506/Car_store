define(['jquery'], function ($) {
    'use strict';

    $(document).on('click', '.navigation li > a', function (e) {

        var parent = $(this).parent();

        if (parent.children('.submenu').length) {
            e.preventDefault();

            $('.navigation .submenu')
                .not(parent.children('.submenu'))
                .slideUp(200);

            parent.children('.submenu')
                .stop(true, true)
                .slideToggle(200);
        }
    });

});