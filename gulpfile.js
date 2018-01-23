// Include gulp
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var international = require('gulp-international');
var del = require('del');
var runSequence = require('run-sequence');

// Compile Our SASS
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true,
        }));
});

//BrowserSync
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

//Useref
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('app/**/*.js', uglify()))
        .pipe(gulpIf('app/**/*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('translate', function() {
    return gulp.src('app/*.html')
        .pipe(international({
            locales: "app/lang",
            verbose: true,
            filename:"${lang}/${name}.${ext}",
        }))
        .pipe(gulp.dest('dist'))
});

//Optimize images
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//Copy Fonts to dist/
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

//Clean /dist if cached
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

//Clear the cache
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback);
});

//Build /app to /dist
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});

// Watch Files For Changes
gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'watch']);
