const webpack = require('webpack');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'app/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.styl$/,
            loader: ['style-loader', 'css-loader', 'stylus-loader'],
            }, {
                test: /\.(eot|otf|ttf|woff)$/,
                loader: 'file-loader',
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
            }],
    },
    node: {
        fs: 'empty'
    },
    resolve: {
        alias: {
            app: 'app',
        },
        modules: [
            path.join(__dirname, 'app'),
            'node_modules',
        ],
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
};
