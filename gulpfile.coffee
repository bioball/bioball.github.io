gulp = require "gulp"
sass = require "gulp-ruby-sass"
watch = require "gulp-watch"
cssMin = require "gulp-minify-css"

gulp.task "sass", ->
  sass("./css/main.sass")
  .pipe gulp.dest("./css/")

gulp.task "sass:min", ->
  sass("./css/main.sass")
  .pipe cssMin()
  .pipe gulp.dest("./css/")

gulp.task "watch", ->
  watch("./css/**/*.sass", -> gulp.start('sass'))