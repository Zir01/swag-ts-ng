var gulp = require('gulp');
gulp.task("dist", function () {
    gulp.src(['app.js', 'package.json', 'README.md']).pipe(gulp.dest('dist'));
});
//# sourceMappingURL=gulpfile.js.map