require.config({"config": {
        "jsbuild":{"Magento_PaymentServicesPaypal/js/helpers/is-fastlane-available.js":"define(['Magento_Customer/js/model/customer'], function (customer) {\n    'use strict';\n\n    /**\n     * Small helper to check if Fastlane is enabled and the User is NOT logged in.\n     *\n     * @retuns {boolean}\n     */\n    return function () {\n        return window.checkoutConfig.payment.payment_services_paypal_fastlane?.isVisible && !customer.isLoggedIn();\n    };\n});\n"}
}});
