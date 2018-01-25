/**
* wiredep task
**/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const wiredep = require('wiredep');
const wiredepStream = wiredep.stream;
const config = require("../config").wiredep;

gulp.task('wiredep', function() {
gulp.src(config.styles.src)
    .pipe(wiredepStream(config.styles.wiredepStream))
	.pipe(gulp.dest(config.styles.dest));

gulp.src(config.html.src)
	.pipe(wiredepStream(config.html.wiredepStream))
	.pipe(gulp.dest(config.html.dest));

});
