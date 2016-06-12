var webpack = require('webpack');

module.exports = {
    entry: [
        './src/main.js'
    ],
    output: {
        path: "/dist/js",
        publicPath: "/dist/",
        filename: "application.js"
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/src|vue-router\//,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loaders: ['css']
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.html$/,
                loader: 'html'
            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve: {
        modulesDirectories: ['node_modules']
    }
};
