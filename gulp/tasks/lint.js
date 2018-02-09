/**
 * lint task
 **/
"use strict";

var gulp = require("gulp");
var config = require("../config").lint;
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var $ = require("gulp-load-plugins")();

function lint(files, opt) {
	return gulp.src(files)
		.pipe($.eslint(opt))
		.pipe(reload(config.reload))
		.pipe($.eslint.format())
		.pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}


gulp.task('lint', () => {
	lint(config.src, config.eslint)
		.pipe(gulp.dest(config.dest))
});
