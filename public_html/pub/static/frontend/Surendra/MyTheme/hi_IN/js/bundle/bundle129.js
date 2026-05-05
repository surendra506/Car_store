require.config({"config": {
        "jsbuild":{"js/menu-click.js":"define(['jquery'], function ($) {\n    'use strict';\n\n    $(document).on('click', '.navigation li > a', function (e) {\n\n        var parent = $(this).parent();\n\n        if (parent.children('.submenu').length) {\n            e.preventDefault();\n\n            $('.navigation .submenu')\n                .not(parent.children('.submenu'))\n                .slideUp(200);\n\n            parent.children('.submenu')\n                .stop(true, true)\n                .slideToggle(200);\n        }\n    });\n\n});"}
}});
