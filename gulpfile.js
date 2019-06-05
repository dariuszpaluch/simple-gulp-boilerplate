var gulp = require("gulp");
var injectSvg = require("gulp-inject-svg");
var sass = require("gulp-sass");
var cssnano = require("gulp-cssnano");
var concatCss = require("gulp-concat-css");
const htmlmin = require("gulp-htmlmin");
var responsive = require("gulp-responsive");
var browserSync = require("browser-sync").create();
const babel = require('gulp-babel');

function _style() {
  return gulp
    .src("src/styles/styles.scss")
    .pipe(sass())
    .pipe(concatCss("styles.css"))
    .pipe(cssnano())
    .pipe(gulp.dest("build/"));
}

function _stylWatch() {
  return _style().pipe(browserSync.stream());
}

function _html() {
  return (
    gulp
      .src("src/**/*.html")
      .pipe(injectSvg({ base: "/src" }))
      // .pipe(htmlmin())
      .pipe(gulp.dest("build/"))
  );
}

function _htmlWatch() {
  return _html().pipe(browserSync.stream());
}

function _assets() {
  return gulp
    .src(["src/**/*.png", "src/**/*.jpg"])
    // .pipe(
    //   responsive({
    //     "assets/profile.png": {
    //       quality: 100,
    //       width: 500
    //     }
    //   })
    // )
    .pipe(gulp.dest("build/"));
}

function _js() {
  return gulp.src('src/app.js')
    .pipe(babel())
    .pipe(gulp.dest('build/')).pipe(browserSync.stream());
}

function watch(cb) {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch("src/**/*.scss", { ignoreInitial: false }, _stylWatch);
  gulp.watch("src/**/*.js", { ignoreInitial: false }, _js);
  gulp.watch(
    ["src/**/*.html", "src/**/*.svg"],
    { ignoreInitial: false },
    _htmlWatch
  );
  gulp.watch(
    ["src/**/*.png", "src/**/*.jpg"],
    { ignoreInitial: false },
    _assets
  );

  cb();
}

function build(cb) {
  gulp.src('libs/**/*').pipe(gulp.dest('build/libs'))

  _style();
  _html();
  _assets();
  _js();

  cb();
}

exports.build = build;
exports.watch = watch;
exports.default = build;
