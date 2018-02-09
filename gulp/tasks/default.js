/**
 * Default task.
 * Cleaning dest folder before building
 **/
"use strict";

const gulp = require("gulp");
const runSequence = require('run-sequence');

gulp.task("default", function () {
	return new Promise(resolve => {
        runSequence(['clean', 'wiredep'], 'build', resolve);
	});
});
