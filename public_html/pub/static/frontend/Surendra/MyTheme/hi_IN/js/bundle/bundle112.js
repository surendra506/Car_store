require.config({"config": {
        "jsbuild":{"Magento_Csp/js/sri.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\nrequire.config({\n    onNodeCreated: function (node, config, moduleName, url) {\n        'use strict';\n        if ('sriHashes' in window && url in window.sriHashes) {\n            node.setAttribute('integrity', window.sriHashes[url]);\n            node.setAttribute('crossorigin', 'anonymous');\n        }\n    }\n});\n"}
}});
