/**
 * build task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config.js").build;

gulp.task('build', ['lint', 'html','fonts', 'extras'], function () {
	return gulp.src(config.src)
		.pipe($.plumber())
		.pipe($.size(config.size));
});
