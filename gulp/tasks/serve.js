/**
 * serve task
 **/
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config").serve;
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const runSequence = require('run-sequence');

gulp.task('serve', function () {
	runSequence(['clean', 'wiredep'], ['styles', 'scripts'])
	browserSync.init(config.browsersync);

	gulp.watch(config.watch_reload).on('change', reload);

	gulp.watch(config.watch.scripts, ['scripts']);
	gulp.watch(config.watch.styles, ['styles']);
	gulp.watch(config.watch.fonts, ['fonts']);
	gulp.watch(config.watch.scripts, ['scripts']);
});
const distConfig = config.dist;

gulp.task('serve:dist', function () {
	//TODO check if dist source are ok
	browserSync(distConfig.browsersync);
});
