/**
 * html task
 * File concact with useref.
 * Then minify js, generated css and html.
 **/
"use strict";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var config = require("../config").html;

gulp.task('html', ['styles'], function() {

    return gulp.src(config.src + '/*.html')
        .pipe($.useref({
            searchPath: config.useref.searchPath
        }))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano(config.cssNano)))
        .pipe($.if('*.html', $.htmlmin(config.htmlmin)))
        .pipe(gulp.dest(config.dest));
});
