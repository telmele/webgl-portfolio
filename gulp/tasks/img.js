/**
 * img task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config").img;
const pngquant = require('imagemin-pngquant');

gulp.task('img', function () {
	return gulp.src(config.src)
		.pipe($.plumber())
		.pipe($.if(
			$.if.isFile, $.cache(
				$.imagemin(
					{
						progressive: config.progressive,
						svgoPlugins: config.svgoPlugins,
						use: [pngquant()]
					}
				)
			)
		))
		.pipe(gulp.dest(config.dest));
});
