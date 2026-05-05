define([
    'require',
    'jquery'
], function (require, $) {
    'use strict';

    function hasAnyBodyClass(classNames) {
        var $body = $('body');

        return classNames.some(function (name) {
            return $body.hasClass(name);
        });
    }

    // Checkout is extremely JS-heavy; avoid running theme scripts that can throw
    // due to missing DOM nodes and block checkout initialization.
    var isCheckoutPage = hasAnyBodyClass([
        'checkout-index-index',
        'checkout-cart-index',
        'checkout-onepage-success'
    ]);

    if (isCheckoutPage) {
        return;
    }

    require([
        'js/header',
        'js/search-toggle',
        'js/switcher-dropdown',
        'js/store-switcher-fix',
        'js/menu-click',
        'js/home-slider-video',
        'js/lambo-models',
        'js/configure-car'
    ], function (header, searchToggle, switcherDropdown) {
        if (typeof switcherDropdown === 'function') {
            switcherDropdown();
        }
    });
});
