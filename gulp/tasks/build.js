/**
 * build task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config.js").build;

gulp.task('build', ['clean', 'lint', 'img', 'extras', 'html'], function () {
	return gulp.src(config.src)
		.pipe($.plumber())
		.pipe($.size(config.size))
		.pipe(gulp.dest(config.dest));
});
