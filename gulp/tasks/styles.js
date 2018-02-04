const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const config = require("../config").styles;
const browserSync = require("browser-sync");
const reload = browserSync.reload;

gulp.task('styles', function () {
	return gulp.src(config.src)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.autoprefixer(config.autoprefixer))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(config.dest));
});
