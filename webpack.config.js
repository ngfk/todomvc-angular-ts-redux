const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.css'],
        alias: {
            'app': path.join(__dirname, 'src')
        }
    },

    entry: {
        vendor: [
            'core-js/es6',
            'core-js/es7/reflect',
            'zone.js/dist/zone'
        ],
        main: path.join(__dirname, 'src', 'main.ts')
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
    },
    
    module: {
        rules: [
            { test: /\.ts$/,   use: ['awesome-typescript-loader', 'angular2-template-loader'] },
            { test: /\.html$/, use: ['html-loader?caseSensitive=true'], include: path.join(__dirname, 'src', 'app') },
            { test: /\.css$/,  use: ['style-loader', 'css-loader'] }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: ['main', 'vendor'] }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        }),

        // Provide context to Angular's use of System.import
        // https://github.com/angular/angular/issues/11580
        // https://github.com/angular/angular/issues/14898 (modification for angular 4)
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, 'src'),
            { } // Routes, if any
        ),
    ],
    
    devServer: {
        port: 9000,
        contentBase: './src'
    }
}
