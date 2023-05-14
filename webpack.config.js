/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.ts'),
    module: {
        rules: [
            //ts loader
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            util: require.resolve('util/'),
            stream: require.resolve('stream/'),
        },
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'build'),
    },
    node: {
        __dirname: false
    },
    plugins: [new EslintPlugin({ extensions: 'ts' }), new CopyWebpackPlugin({
        patterns: [
            './node_modules/swagger-ui-dist/swagger-ui.css',
            './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
            './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
            './node_modules/swagger-ui-dist/favicon-16x16.png',
            './node_modules/swagger-ui-dist/favicon-32x32.png'
        ]
    })],
    externals: {
        express: "require('express')",
        cookieParser: "require('cookie-parser')",
        cors: "require('cors')",
        crypto: "require('crypto')",
        fs: "require('fs')",
        path: "require('path')",
        mongodb: "require('mongodb')",
    },
};
