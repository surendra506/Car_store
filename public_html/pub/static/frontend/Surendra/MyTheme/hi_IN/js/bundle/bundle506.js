require.config({"config": {
        "jsbuild":{"Magento_PaymentServicesPaypal/js/helpers/remove-paypal-url-token.js":"define(function () {\n    'use strict';\n\n    return function () {\n            // Remove the URL hash token to prevent refreshes trying to resume the same payment.\n            const params = new URLSearchParams(window.location.search);\n            params.delete('token');\n            window.history.replaceState('', document.title, window.location.pathname + '?' + params.toString());\n    };\n});\n"}
}});
