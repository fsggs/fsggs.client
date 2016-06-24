import gulp from 'gulp'
import gutil from 'gulp-util'

import webpack from 'webpack'
import WebpackDevServer from "webpack-dev-server"
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import AppCachePlugin from 'appcache-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import WatchLiveReloadPlugin from 'webpack-watch-livereload-plugin'

import path from 'path'
import del from 'del'

var webpack_config = {
    cache: false,
    devtool: 'source-map',
    entry: [
        //'webpack-dev-server/client?http://0.0.0.0:8080',
        //'webpack/hot/only-dev-server',
        './src/main.js'
    ],
    output: {
        path: path.resolve('./dist/'),
        publicPath: '',
        filename: 'assets/js/application.js'
    },
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
                loader: ExtractTextPlugin.extract('style', 'css', 'sass')
            },
            {
                test: /\.less$/i,
                loader: ExtractTextPlugin.extract('style', 'css', 'less')
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
    }
};

var webpack_config_prod_plugins = {
    plugins: [
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
        }),
        new CopyWebpackPlugin([
            {from: 'favicon.ico'}
        ])
    ]
};
var webpack_config_dev_plugins = {
    watch: true,
    devtool: 'eval',
    debug: true,
    plugins: [
        new ExtractTextPlugin('assets/css/application.css', {allChunks: true}),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new HtmlWebpackPlugin({
            cache: true,
            filename: 'index.html',
            template: 'src/index.ejs',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            title: 'Loading...',
            inject: true
        }),
        new CopyWebpackPlugin([
            {from: 'favicon.ico'}
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new WatchLiveReloadPlugin({
            files: [
                './src/**/*'
            ]
        })
    ]
};

gulp.task('webpack:build', () => {
    let webpack_config_production = Object.assign({}, webpack_config, webpack_config_prod_plugins);

    webpack(webpack_config_production, (error, stats) => {
        if (error) {
            let pluginError = new gutil.PluginError('webpack', error);
            gutil.log("[webpack]", pluginError);
            return;
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
    });
});

gulp.task('webpack:build-dev', () => {
    let webpack_config_development = Object.assign({}, webpack_config, webpack_config_dev_plugins, {
        watch: false
    });

    webpack(webpack_config_development, (error, stats) => {
        if (error) {
            let pluginError = new gutil.PluginError('webpack', error);
            gutil.log("[webpack]", pluginError);
            return;
        }
        gutil.log('[webpack]', stats.toString({colors: true}));
    });
});

gulp.task('webpack:server', () => {
    let webpack_config_development = Object.assign({}, webpack_config, webpack_config_dev_plugins);

    new WebpackDevServer(webpack(webpack_config_development), {
        publicPath: "/" + webpack_config_development.output.publicPath,
        //hot: true,
        stats: {colors: true}
    }).listen(8080, '0.0.0.0', (err) => {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/");
    });
});

// gulp.task('watch', () => {
//     gulp.watch(['src/**/*'], ['webpack:build-dev']);
// });

gulp.task('clean', () => {
    return del(['dist']);
});

gulp.task('build', ['clean'], () => {
    gulp.start('webpack:build');
});

gulp.task('default', ['webpack:server' /*, 'watch' */]);
