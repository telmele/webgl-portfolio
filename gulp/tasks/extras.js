/**
* extras task
**/
"use strict";

const gulp = require("gulp");
const config = require("../config").extras;

gulp.task('extras', function() {
    return gulp.src(config.src, config.options)
    .pipe(gulp.dest(config.dest));
});
