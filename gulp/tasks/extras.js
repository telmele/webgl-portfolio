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
 * extras task
 **/
"use strict";

const gulp = require("gulp");
const config = require("../config").extras;

gulp.task('extras', () => {
	return gulp.src(config.src, {
		dot: true,
		"base" : "./app"
	})
		.pipe(gulp.dest(config.dest));
});