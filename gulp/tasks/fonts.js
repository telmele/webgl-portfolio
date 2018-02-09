/**
 * fonts task
 **/
"use strict";

const gulp = require("gulp");
const config = require("../config").fonts;

gulp.task('fonts', function () {
	return gulp.src(
		require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', (err) => {
		})
			.concat(config.src))
		.pipe(gulp.dest(config.tmp));
});
