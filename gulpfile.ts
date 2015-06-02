var gulp = require('gulp');
var clean = require('gulp-clean');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var gulpMocha = require('gulp-mocha');

gulp.task('test', function () {
    //return gulp.src('./test/*.js', { read: false })
    //    .pipe(gulpMocha({ reporter: '' }));
});


gulp.task("clean", ['test'], () => {
    return gulp.src('dist/*', { read: false }).pipe(clean());
});

gulp.task("bump", ['clean'], () => {
    return gulp.src('./publish.json')
        .pipe(bump())
        .pipe(gulp.dest('./'))
        .pipe(rename('package.json'))
        .pipe(gulp.dest('dist'));
});

gulp.task("distBin", ['bump'], () => {
    return gulp.src(['lib/**/*.js'])
        .pipe(gulp.dest('dist/lib'));
});

gulp.task("dist", ['distBin'], () => {
    
    return gulp.src(['app.js', 'README.md'])
        .pipe(gulp.dest('dist'));
});







