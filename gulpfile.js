const gulp = require('gulp')
const gutil = require('gulp-util')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const livereload = require('gulp-livereload')
const eslint = require('gulp-eslint')
const merge = require('merge-stream')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const reactify = require('reactify')
const watchify = require('watchify')
const babelify = require('babelify')

const bowerDir = './public/bower_components'
const scriptsDir = './src/js'
const stylesDir = './src/css'
const buildScriptsDir = './public/js'
const buildStylesDir = './public/css'

function handleErrors() {
  var args = Array.prototype.slice.call(arguments)
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args)
  this.emit('end')
}

gulp.task('css', function() {
  var cssFiles = gulp.src([
    bowerDir + '/animate.css/animate.css',
    bowerDir + '/nprogress/nprogress.css',
    bowerDir + '/summernote/dist/summernote.css',
    bowerDir + '/select2/dist/css/select2.css',
    bowerDir + '/select2-bootstrap-theme/dist/select2-bootstrap.css',
    bowerDir + '/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
  ])
  var scssFiles = gulp.src(stylesDir + '/style.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
        bowerDir + '/bootstrap-sass/assets/stylesheets',
        bowerDir + '/bootswatch/paper', // Edit this line to change Bootswatch theme
        bowerDir + '/font-awesome/scss'
      ]})
      .on('error', notify.onError(function(error) {
        return 'Error: ' + error.message
      }))
    )

  return merge(cssFiles, scssFiles)
    .pipe(concat('style.css'))
    .pipe(cleanCSS({processImport: false}))
    .pipe(gulp.dest(buildStylesDir))
    .pipe(livereload())
})

gulp.task('fonts', function() {
  gulp.src(bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/**.*').pipe(gulp.dest('./public/fonts/bootstrap'))
  gulp.src(bowerDir + '/summernote/dist/font/summernote.*').pipe(gulp.dest('./public/css/font'))
  return gulp.src(bowerDir + '/font-awesome/fonts/**.*').pipe(gulp.dest('./public/fonts'))
})

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '**/*.jsx', '!node_modules/**', '!public/**'])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulp.dest('.'))
    .pipe(eslint.failAfterError())
})

gulp.task('nodemon', function() {
  gutil.log('Nodemon...')
  return nodemon({
    script: 'app.js',
    ext: 'css js jade',
    ignore: ['public/*', 'src/*'],
    env: { 'NODE_ENV': 'development' }
  }).on('restart', function() {
    gulp.src('app.js')
      .pipe(livereload())
  })
})

function buildScript(file, watch) {
  var props = {
    entries: [scriptsDir + '/script.js', scriptsDir + '/' + file],
    debug: true,
    transform: [babelify, reactify],
    cache: {},
    packageCache: {}
  }
  var bundler = watch ? watchify(browserify(props)) : browserify(props)
  if (watch) {
    livereload.listen()
    gulp.watch(stylesDir + '/**/*.scss', ['css'])
  }
  function rebundle() {
    var stream = bundler.bundle()
    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest(buildScriptsDir + '/'))
      .pipe(livereload())
  }
  bundler.on('update', function() {
    rebundle()
    gutil.log('Rebundle...')
  })
  return rebundle()
}

gulp.task('build', ['css', 'fonts'], function() {
  return buildScript('app.js', false)
})

gulp.task('default', ['nodemon', 'css', 'fonts'], function() {
  return buildScript('app.js', true)
})
