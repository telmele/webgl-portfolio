/**
 * Created by hikingyo on 13/09/16.
 * gulp task scripts
 */
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config").scripts;
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('scripts', ['lint'], function () {
	return gulp.src(config.src)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(config.dest))
		.pipe(reload({stream: true}));
});
