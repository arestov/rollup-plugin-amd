'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var convert = _interopDefault(require('@buxlabs/amd-to-es6'));
var rollupPluginutils = require('rollup-pluginutils');
var os = _interopDefault(require('os'));

var isWindows = os.platform() === 'win32';

var firstpass = /\b(?:define)\b/;
var importStatement = /\b(import .*['"])(.*)(['"].*\n)/g;

function index(options) {
    if ( options === void 0 ) options = {};

    var filter = rollupPluginutils.createFilter( options.include, options.exclude );

    return {
        name: 'amd',

        transform: function transform (code, id) {
            if ( !filter( id ) ) { return; }
            if ( !firstpass.test( code ) ) { return; }

            var transformed = convert(code, options.converter);
            if (options.rewire) {
                transformed = transformed.replace(importStatement, function (match, begin, moduleId, end) {
                    var rewire = isWindows ? options.rewire(moduleId, id).split('\\').join('\\\\') : options.rewire(moduleId, id);
                    return ("" + begin + (rewire || moduleId) + end);
                });
            }

            return transformed;
        }
    };
}

module.exports = index;
//# sourceMappingURL=rollup-plugin-amd.cjs.js.map
