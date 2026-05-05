require.config({"config": {
        "jsbuild":{"jquery/ui-modules/version.js":"( function( factory ) {\n    \"use strict\";\n\n    if ( typeof define === \"function\" && define.amd ) {\n\n        // AMD. Register as an anonymous module.\n        define( [ \"jquery\" ], factory );\n    } else {\n\n        // Browser globals\n        factory( jQuery );\n    }\n} )( function( $ ) {\n    \"use strict\";\n\n    $.ui = $.ui || {};\n\n    return $.ui.version = \"1.13.2\";\n\n} );\n"}
}});
