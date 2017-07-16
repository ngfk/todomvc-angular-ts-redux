const path              = require('path');
const webpack           = require('webpack');
const webpackMerge      = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AotPlugin }     = require('@ngtools/webpack');

// Environment defaults to development
process.env.NODE_ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV.toLowerCase()
    : 'development';

// Common configuration
const common = {

    entry: {
        polyfills: [
            'core-js/es6',
            'core-js/es7/reflect',
            'zone.js/dist/zone',
        ],
        vendor: [
            '@angular/core',
            '@angular/common',
            '@angular/compiler',
            '@angular/forms',
            '@angular/http',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/router',

            'rxjs/Observable',
            'rxjs/Subscription',
            'rxjs/Subject',
            'rxjs/BehaviorSubject',
            'rxjs/add/operator/map',
            'rxjs/add/operator/distinctUntilChanged',

            '@ailurus/ts-redux',
            '@angularclass/hmr',
        ],
        main: path.join(__dirname, './src/main.ts')
    },

    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
    },

    resolve: {
        extensions: ['.ts', '.js', '.css'],
        alias: {
            'root': path.join(__dirname, '.'),
            'app': path.join(__dirname, './src')
        }
    },

    plugins: [
        // Creates chucks to be cached by browsers
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),

        // Creates the root html page injecting the generated scripts & styles
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        }),

        // Add NODE_ENV to client side
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),

        // Provide context to Angular's use of System.import
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, 'src'),
            { } // Routes, if any
        ),
    ],
    
}

// Development specific configuration
const development = {

    devtool: 'cheap-module-eval-source-map',

    entry: {
        polyfills: ['zone.js/dist/long-stack-trace-zone']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use : [
                    {
                        loader: '@angularclass/hmr-loader',
                        options: { pretty: false, prod: false }
                    },
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            silent: true,
                            configFileName: path.join(__dirname, 'tsconfig.json')
                        }
                    },
                    { loader: 'angular2-template-loader' }
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: { minimize: false }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        // Print module names instead of numbers
        new webpack.NamedModulesPlugin()
    ],

    devServer: {
        host: '0.0.0.0',
        port: 9000,
        historyApiFallback: true,
        stats: 'minimal'
    }
}

// Production specific configuration
const production = {

    devtool: 'source-map',

    module: {
        rules: [
            { test: /\.ts$/, use: '@ngtools/webpack' },
            { test: /\.html$/, use: 'html-loader' },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },

    plugins: [
        // Stop build on error
        new webpack.NoEmitOnErrorsPlugin(),

        // Ahead of time compilation
        new AotPlugin({
            tsConfigPath: path.join(__dirname, 'tsconfig.json'),
            entryModule: path.join(__dirname, 'src/app/app.module#AppModule')
        }),

        // Ugilify javascript
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                screw_ie8: true,
                warnings: false,
            },
            mangle: {
                keep_fnames: true,
                screw_i8: true,
            }
        }),

        // Include css as a seperate file
        new ExtractTextPlugin('main.css')
    ]
};

// Merge common config with environment specific config.
switch (process.env.NODE_ENV) {
    default:
    case 'development':
        module.exports = webpackMerge(common, development);
        break;
    case 'production':
        module.exports = webpackMerge(common, production);
        break;
}
