/**
 * html task
 * File concact with useref.
 * Then minify js, generated css and html.
 **/
"use strict";

const  gulp = require("gulp");
const  $ = require("gulp-load-plugins")();
const config = require("../config").html;
const cssnano = require('cssnano');

gulp.task('html', ['styles', 'scripts'], function () {
	return gulp.src('app/*.html')
		.pipe($.international(config.international))
		.pipe($.useref(config.useref))
		.pipe($.if(/\.js$/, $.uglify(config.uglify)))
		.pipe($.if(/\.css$/, $.postcss([cssnano()])))
		.pipe($.if(/\.html$/, $.htmlmin(config.htmlmin)))
		.pipe(gulp.dest('dist'));
});
