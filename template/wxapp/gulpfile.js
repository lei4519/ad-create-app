const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const replace = require('gulp-replace')
const pxtorpx = require('postcss-px2rpx')
const cleanCSS = require('gulp-clean-css')

const PATH = './**/*.scss'
const IGNORE_PATH = [
  './**/_*.scss',
  'node_modules/**/*',
  'miniprogram_npm/**/*'
]
const sass2wxss = () => {
  return gulp
    .src(PATH, {
      ignore: IGNORE_PATH,
      since: gulp.lastRun(sass2wxss)
    })
    .pipe(
      replace(/@import(.+?);/g, ($1, $2) =>
        /*! 这种注释不会被clean-css 处理 */
        $2.includes('./_') ? $1 : `/*! ${$1} */`
      )
    )
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([pxtorpx()]))
    .pipe(cleanCSS())
    .pipe(replace(/\/\*!\s(@import\s+.+;)\s\*\//g, ($1, $2) => $2))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(gulp.dest('./'))
}

gulp.task('transform sass to wxss', sass2wxss)

gulp.task('watch sass file change...', () => {
  gulp.watch(PATH, gulp.parallel('transform sass to wxss'))
})

gulp.task(
  'sass2wxss',
  gulp.series('transform sass to wxss', 'watch sass file change...')
)
