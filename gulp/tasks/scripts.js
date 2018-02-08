/**
 * Created by hikingyo on 13/09/16.
 * gulp task scripts
 */
"use strict";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config").scripts;

gulp.task('scripts', function() {
		gulp.src(config.entry)
			.pipe($.browserify({
				insertGlobals : true
			}))
			.pipe(gulp.dest(config.dest));
});

gulp.task('scripts:dist', function() {
    return gulp.src(config.src)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest));
});


