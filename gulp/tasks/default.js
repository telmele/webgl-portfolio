/**
* Default task.
* Cleaning dest folder before building
**/
"use strict";

const gulp = require("gulp");

gulp.task("default", ["clean"], function () {
    gulp.start("build");
});
