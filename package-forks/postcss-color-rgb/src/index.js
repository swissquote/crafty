const parser = require('postcss-value-parser');
const functionalNotation = require('./lib/rgb-functional-notation');

function transformRgb(value) {
    return parser(value).walk(node => {
        /* istanbul ignore if */
        if (node.type !== 'function' ||
            node.value !== 'rgb' &&
            node.value !== 'rgba'
        ) {
            return;
        }
        node.value = functionalNotation.legacy(parser.stringify(node));
        node.type = 'word';
    }).toString();
}

module.exports = () => ({
    postcssPlugin: 'postcss-color-rgb',
    Declaration(decl) {
        /* istanbul ignore if */
        if (!decl.value ||
            decl.value.indexOf('rgb(') === -1 &&
            decl.value.indexOf('rgba(') === -1
        ) {
            return;
        }
        decl.value = transformRgb(decl.value);
    }
});

module.exports.postcss = true;
