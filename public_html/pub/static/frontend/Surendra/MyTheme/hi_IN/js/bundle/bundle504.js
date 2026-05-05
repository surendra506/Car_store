require.config({"config": {
        "jsbuild":{"Magento_PaymentServicesPaypal/js/helpers/get-street-line-count.js":"define(['uiRegistry'], function (uiRegistry) {\n    'use strict';\n\n    /**\n     * Returns the integer count of the number of street lines available on a customer address.\n     *\n     * @returns {number}\n     */\n    return function () {\n        const shippingAddress = uiRegistry.get('checkout.steps.shipping-step.shippingAddress');\n        return Object.values(shippingAddress.source.shippingAddress.street).length;\n    };\n});\n"}
}});
