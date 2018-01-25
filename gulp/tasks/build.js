/**
 * build task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config.js").build;

gulp.task('build', ['lint', 'html', 'img', 'fonts', 'extras'], function () {
	return gulp.src(config.src)
		.pipe($.size(config.size))
		.pipe(gulp.dest(config.dest));
});
