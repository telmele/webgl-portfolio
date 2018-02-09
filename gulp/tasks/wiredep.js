/*
 * Copyleft (c) 2018
 *  ----------------------------------------------------------------------------
 *  "THE BEER-WARE LICENSE" (Revision 42):
 * <$user.mail> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 *  this stuff is worth it, you can buy me a beer in return $user.forname $user.name
 *  ----------------------------------------------------------------------------
 *
 */

/**
 * wiredep task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config.js").wiredep;
const wiredep = require("wiredep").stream;

gulp.task('wiredep', () => {
	gulp.src(config.src)
		.pipe(wiredep(config.wiredep))
		.pipe(gulp.dest(config.dest));
})


