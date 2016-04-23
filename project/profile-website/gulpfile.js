var gulp = require('gulp');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var del = require('del');
var cache = require('gulp-cache');

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

/* Run this to clear cache. Currently not included in 'default' task since I won't be
* running this every time !!! */
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback);
});

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyHtml', function() {
    return gulp.src('dist/*.html')
        .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('default', function (callback) {
    runSequence('clean:dist', ['images', 'useref'], 'minifyHtml',
        callback
    );
});