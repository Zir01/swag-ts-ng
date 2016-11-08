var gulp = require('gulp');
var clean = require('gulp-clean');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var gulpMocha = require('gulp-mocha');
var tsConfig = require('./tsconfig.json')
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var path = require('path')
var ts = require('gulp-typescript')
var util = require('gulp-util');
var notifier = require('node-notifier');
var tsconfig = require('./tsconfig.json');
var tsProject = ts.createProject('tsconfig.json',{
  declaration: true,
  typescript: require('typescript')
});

var lastTsErrorMsg:string = null;
var errorCount = 0;
//regex taken from: https://github.com/chalk/ansi-regex/blob/master/index.js#L3
//need to remove these characters, because otherwise we end up with garbled messaged for non-terminal notifications
const removeColorsReg = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
gulp.task('build', function() {
  console.info('compiling ts')
  console.time('compilation done')
  var tsResult = gulp.src(tsConfig.filesGlob)
        .pipe(sourcemaps.init())
				.pipe(ts(tsProject))
        .on('error', function(e:any){errorCount++; lastTsErrorMsg = e.message})
  return merge([
        tsResult.dts.pipe(gulp.dest(tsConfig.compilerOptions.outDir)),
        tsResult.js.pipe(gulp.dest(tsConfig.compilerOptions.outDir)).on('end', function(){'ts compilation done'}),
        tsResult.pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(tsConfig.compilerOptions.outDir))
    ])
    .pipe(util.noop())//fake pipe needed, otherwise there is no on-end event
    .on('end', function(){
      console.timeEnd('compilation done')
      if (lastTsErrorMsg) {
        notifier.notify({title: 'Server Compilation Errors (' + errorCount + ')', message: lastTsErrorMsg.replace(removeColorsReg, '')})
        lastTsErrorMsg = null; errorCount = 0;
      } else {
        notifier.notify({title: 'Server',message:'Compilation finished'})
      }
    })
})
gulp.task('watch', ['build'], function() {
  gulp.watch(tsConfig.filesGlob, ['build'])
});
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
