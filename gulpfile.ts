var gulp = require('gulp');
gulp.task("dist", () => {
    gulp.src(['app.js','package.json', 'README.md'])
        .pipe(gulp.dest('dist'));
});





