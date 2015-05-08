var gulp = require('gulp');
var clean = require('gulp-clean');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
gulp.task("clean", function () {
    return gulp.src('dist/*', { read: false }).pipe(clean());
});
gulp.task("bump", ['clean'], function () {
    return gulp.src('./publish.json')
        .pipe(bump())
        .pipe(gulp.dest('./'))
        .pipe(rename('package.json'))
        .pipe(gulp.dest('dist'));
});
gulp.task("dist", ['bump'], function () {
    return gulp.src(['app.js', 'README.md'])
        .pipe(gulp.dest('dist'));
});
//# sourceMappingURL=gulpfile.js.map