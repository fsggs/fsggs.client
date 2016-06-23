var gulp = require('gulp');
var gutil = require('gulp-util');
var copy = require('gulp-copy');
var watch = require('gulp-watch');

var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');

var webpack_config = {
    cache: true,
    devtool: 'source-map',
    entry: [
        './src/main.js'
    ],
    output: {
        path: "./dist/",
        publicPath: "",
        filename: "assets/js/application.js"
    },
    watch: false,
    module: {
        loaders: [
            {
                test: /\.js$/i,
                exclude: /node_modules|vue\/src|vue-router\//,
                loader: 'babel'
            },
            {
                test: /\.css$/i,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.scss$/i,
                loader: ExtractTextPlugin.extract('style', 'sass')
            },
            {
                test: /\.less$/i,
                loader: ExtractTextPlugin.extract('style', 'less')
            },
            {
                test: /\.vue$/i,
                loader: 'vue'
            },
            {
                test: /\.html$/i,
                loader: 'html'
            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime'],
        cacheDirectory: true
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new CleanWebpackPlugin(['./assets'], {verbose: true}),
        new ExtractTextPlugin('assets/css/application.css', {allChunks: true}),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new AppCachePlugin({
            network: ['gate.json'],
            output: 'manifest.cache'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.ejs',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            title: 'Loading...',
            inject: true
        })
    ]
};

gulp.task('webpack', function () {
    webpack(webpack_config, function (error, stats) {
        if (error) {
            var pluginError = new gutil.PluginError('webpack', error);
            gutil.log("[webpack]", pluginError);
            return;
        }
        gutil.log('[webpack]', stats.toString());
    });
});

gulp.task('default', ['webpack']);
