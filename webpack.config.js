const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './pfp.js',
    output: {
        filename: 'bundle.js',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
