/**
 * serve task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config").serve;
const browserSync = require("browser-sync");
const reload = browserSync.reload;

gulp.task('serve', ['styles', 'fonts'], function () {
	browserSync.init(config.browsersync);

	gulp.watch(config.watch_reload).on('change', reload);

	gulp.watch(config.watch.styles, ['styles']);
	gulp.watch(config.watch.fonts, ['fonts']);
});

const testConfig = config.test;

gulp.task('serve:test', function () {
	browserSync(testConfig.browsersync);

	gulp.watch(testConfig.watch).on('change', reload);
	gulp.watch(testConfig.watch, ['lint:test']);
});

const distConfig = config.dist;

gulp.task('serve:dist', function () {
	//TODO check if dist source are ok
	browserSync(distConfig.browsersync);
});
