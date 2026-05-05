require.config({"config": {
        "jsbuild":{"vimeo/vimeo-wrapper.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'vimeo'\n], function (Player) {\n    'use strict';\n\n    window.Vimeo = window.Vimeo || {\n        'Player': Player\n    };\n});\n"}
}});
