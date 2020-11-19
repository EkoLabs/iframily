/* eslint-env node, node */
'use strict';

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
    const isDevelopmentMode = argv.mode === 'development';

    const config = {
        entry: path.join(__dirname, 'src', 'iframily.js'),

        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'iframily.min.js',
            library: 'Iframily',
            libraryTarget: 'umd'
        },

        devtool: isDevelopmentMode ? 'eval' : 'source-map',

        module: {
            rules: [
                {
                    // NOTE: This lints only files bundled by webpack (and not the "tests" folder for example...)
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        // Show only errors while developing.
                        quiet: isDevelopmentMode,

                        // Fail on warning/errors when not developing.
                        failOnWarning: !isDevelopmentMode,
                        failOnError: !isDevelopmentMode
                    },
                },
                {
                    test: /\.js$/,
                    exclude: path.join(__dirname, 'node_modules'),
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },

        plugins: [new CleanWebpackPlugin()]
    };

    if (isDevelopmentMode) {
        config.plugins = config.plugins || [];

        // Used for tests to identify development bundle.
        config.plugins.push(new webpack.BannerPlugin({
            banner: 'DEVELOPMENT BUNDLE'
        }));
    }

    return config;
};
