require.config({"config": {
        "jsbuild":{"Magento_Csp/js/nonce-injector.js":"/**\n * Copyright 2024 Adobe\n * All Rights Reserved.\n */\n\ndefine('Magento_Csp/js/nonce-injector', [], function () {\n    'use strict';\n\n    return function (config) {\n        window.cspNonce = config.nonce;\n    };\n});\n"}
}});
