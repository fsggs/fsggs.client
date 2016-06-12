var gulp = require('gulp');
var batch = require('gulp-batch');
var connect = require('gulp-connect');
var copy = require('gulp-copy');
var watch = require('gulp-watch');

var webpack = require('webpack-stream');

gulp.task('webpack', function () {
    return gulp.src('src/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/js/'))
        .pipe(connect.reload());
});

gulp.task('server', function () {
    connect.server({
        livereload: true,
        root: 'dist'
    });
});

gulp.task('index', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['webpack', 'server', 'index']);
