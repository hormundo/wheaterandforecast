const { src, dest, watch , parallel } = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

function css() {
  return src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(cssnano())
  .pipe(sourcemaps.write('./'))
  .pipe(dest('./dist/css/'));
}

function javascript() {
  return src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js')) // final output file name
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./dist/js'))
}

function watchArchivos() {
  watch( 'src/scss/**/*.scss', css );
  watch( 'src/js/**/*.js', javascript );
}

exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, watchArchivos ); 