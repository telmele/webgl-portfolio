/**
 * html task
 * File concact with useref.
 * Then minify js, generated css and html.
 **/
"use strict";

const  gulp = require("gulp");
const  $ = require("gulp-load-plugins")();
const config = require("../config").html;
const cssnano = require('cssnano');
const pump = require("pump");


gulp.task('html', ['styles', 'scripts'], function (cb) {

	function createErrorHandler(name) {
		return function (err) {
			console.error('Error from ' + name + ' in compress task', err.toString());
		};
	}
	// pump([
		return gulp.src('app/*.html')
			.pipe($.international(config.international))
			.pipe($.useref(config.useref))
			.on('error', createErrorHandler('useref'))
			.pipe($.if(/\.js$/, $.uglify(config.uglify)))
			.on('error', createErrorHandler('uglify'))
			.pipe($.if(/\.css$/, $.postcss([cssnano()])))
			.on('error', createErrorHandler('css'))
			// .pipe($.replace(/(css|js|img)+(\/[a-z0-9.\/]+\.(css|js|jpg|png))/gi, '../$1$2'))
			.pipe($.if(/\.html$/, $.htmlmin(config.htmlmin)))
			.pipe(gulp.dest('dist'))
	// ],
	// 	cb
	// );
});
