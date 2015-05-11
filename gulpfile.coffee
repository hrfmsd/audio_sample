gulp = require 'gulp'
browserify = require 'browserify'
source = require 'vinyl-source-stream'
browserSync = require 'browser-sync'
plumber = require 'gulp-plumber'
notify = require 'gulp-notify'
sourcemaps = require 'gulp-sourcemaps'
watch = require 'gulp-watch'
uglify = require 'gulp-uglify'
sass = require 'gulp-sass'
bourbon = require 'node-bourbon'
jade = require 'gulp-jade'
gulpFilter = require 'gulp-filter'
mainBowerFiles = require 'main-bower-files'
typescript = require 'gulp-typescript'
concat = require 'gulp-concat'

DEST = './public'
SRC = './src'

paths =
  src:
    ts: ["#{SRC}/typescript/**/*.ts"]
    jade: ["#{SRC}/jade/**/*.jade", "!#{SRC}/jade/**/_*.jade"]
    scss: ["#{SRC}/scss/**/*.scss"]
  dest:
    js: "#{DEST}/assets/js"
    html: DEST
    css: "#{DEST}/assets/css"

bourbon.with "#{SRC}/scss/application"

gulp.task 'sass', ->
  gulp.src paths.src.scss
  .pipe plumber
    errorHandler: notify.onError('<%= error.message %>')
  .pipe sourcemaps.init()
  .pipe sass
    includePaths: bourbon.includePaths
  .pipe sourcemaps.write()
  .pipe gulp.dest paths.dest.css
  .pipe browserSync.reload
    stream: true

gulp.task 'jade', ->
  gulp.src paths.src.jade
  .pipe jade
    pretty: true
  .pipe gulp.dest paths.dest.html
  .pipe browserSync.reload
    stream: true

#gulp.task 'bower', ->
#  jsFilter = gulpFilter '**/*.js'
#  cssFilter = gulpFilter '**/*.css'
#
#  gulp.src(mainBowerFiles())
#  .pipe jsFilter
#  .pipe gulp.dest './src/js/lib/'
#  .pipe jsFilter.restore()
#  .pipe cssFilter
#  .pipe gulp.dest './src/css/lib/'

gulp.task 'tsify', ->
  browserify()
  .add "#{SRC}/typescript/main.ts"
  .plugin 'tsify'
  .bundle()
  .pipe source 'app.js'
  .pipe gulp.dest paths.dest.js
  .pipe browserSync.reload
    stream: true

gulp.task 'browser-sync', ->
  browserSync.init null,
    server: './public'
    reloadDelay: 2000

gulp.task 'watch', ->
  watch paths.src.scss, ->
    gulp.start ['sass']
  watch paths.src.jade, ->
    gulp.start ['jade']
  watch paths.src.ts, ->
    gulp.start ['build']

gulp.task 'tsb', ->
  gulp.src ['./src/typescript/main.ts']
  .pipe typescript
    target: 'ES5',
    module: 'commonjs'
#    module: 'amd'
    removeComments: true,
    sortOutput: true
  .js
  .pipe concat 'main.js'
  .pipe gulp.dest './src/js/'

gulp.task 'brow', ->
  browserify
    entries: ['./src/js/main.js']
  .bundle()
  .pipe source 'app.js'
  .pipe gulp.dest './public/assets/js/'

gulp.task 'build', ['tsb', 'brow']
#gulp.task 'default', ['sass', 'jade', 'bower', 'tsify', 'browser-sync', 'watch']
#gulp.task 'default', ['sass', 'jade', 'build', 'browser-sync', 'watch']
gulp.task 'default', ['sass', 'jade', 'build', 'watch']
#gulp.task 'default', ['sass', 'jade', 'tsb', 'browser-sync', 'watch']
