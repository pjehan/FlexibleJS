var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var nodemon = require('gulp-nodemon');
var notify = require("gulp-notify");
var debug = require('gulp-debug');
var livereload = require('gulp-livereload');
var merge = require('merge-stream');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require("reactify");
var watchify = require('watchify');
var babelify = require('babelify');

var npmDir = './node_modules'
var scriptsDir = './src/js';
var stylesDir = './src/css';
var buildScriptsDir = './public/js';
var buildStylesDir = './public/css';


function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end');
}

gulp.task('css', function() {

  var cssFiles = gulp.src([
    npmDir + '/nprogress/nprogress.css',
    npmDir + '/react-summernote/dist/react-summernote.css',
    npmDir + '/select2/dist/css/select2.css'
  ]);
  var scssFiles = gulp.src(stylesDir + '/style.scss')
  .pipe(sass({
    outputStyle: 'compressed',
    includePaths: [
      npmDir + '/bootstrap-sass/assets/stylesheets',
      npmDir + '/bootswatch/paper', // Edit this line to change Bootswatch theme
      npmDir + '/font-awesome/scss',
    ]})
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
    }))
  );

  return merge(cssFiles, scssFiles)
  .pipe(concat('style.css'))
  .pipe(cleanCSS({processImport: false}))
  .pipe(gulp.dest(buildStylesDir))
  .pipe(livereload());
});

gulp.task('fonts', function(){
  gulp.src(npmDir + '/react-summernote/dist/summernote.*')
    .pipe(gulp.dest('./public/css'));
  return gulp.src(npmDir + '/font-awesome/fonts/**.*')
  .pipe(gulp.dest('./public/fonts'));
});

gulp.task('nodemon', function() {
  gutil.log('Nodemon...');
  return nodemon({
    script: 'app.js'
    , ext: 'css js jade'
    , ignore: ['public/*', 'src/*']
    , env: { 'NODE_ENV': 'development' }
  }).on('restart', function(){
    gulp.src('app.js')
    .pipe(livereload())
  });
});

function buildScript(file, watch) {
  var props = {
    entries: [scriptsDir + '/script.js', scriptsDir + '/' + file],
    debug: true,
    transform:  [babelify, reactify],
    cache: {},
    packageCache: {}
  };
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  if (watch) {
    livereload.listen();
    gulp.watch(stylesDir + '/**/*.scss', ['css']);
  }
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
    .pipe(source(file))
    .pipe(gulp.dest(buildScriptsDir + '/'))
    .pipe(livereload())
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}

gulp.task('build', ['nodemon', 'css', 'fonts'], function() {
  return buildScript('app.js', false);
});

gulp.task('default', ['nodemon', 'css', 'fonts'], function() {
  return buildScript('app.js', true);
});
