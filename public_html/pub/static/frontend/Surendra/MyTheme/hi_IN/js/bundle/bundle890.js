require.config({"config": {
        "jsbuild":{"Magento_Persistent/js/remember-me-config.js":"/**\n * Copyright 2024 Adobe\n * All Rights Reserved.\n */\n\ndefine(\n    [\n        'ko',\n        'uiComponent'\n    ],\n    function (ko, Component) {\n        'use strict';\n\n        return Component.extend({\n            dataScope: 'global',\n            config: {},\n\n            /** @inheritdoc */\n            initialize: function () {\n                this._super();\n\n                window.rememberMeConfig = this.config;\n            }\n        });\n    }\n);\n"}
}});
