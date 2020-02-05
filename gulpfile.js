/* Needed gulp config */

var gulp = require("gulp");
var plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync");

const reload = browserSync.reload;

function imagesFunc() {
  return gulp
    .src(["img/*"])
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest("img"));
}

function scripts() {
  return gulp
    .src([
      /* Add your JS files here, they will be combined in this order */
      "js/vendor/jquery.min.js",
      "js/vendor/jquery.easing.1.3.js",
      "js/vendor/jquery.stellar.min.js",
      "js/vendor/owl.carousel.min.js",
      "js/vendor/bootstrap.min.js",
      "js/vendor/jquery.waypoints.min.js"
    ])
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("js"));
}

function minifyCustom() {
  return gulp
    .src([
      /* Add your JS files here, they will be combined in this order */
      "js/custom.js"
    ])
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("js"));
}

function minifySass() {
  return (
    gulp
      .src("scss/style.scss")
      .pipe(plumber())
      .pipe(
        sass({
          errLogToConsole: true,

          //outputStyle: 'compressed',
          // outputStyle: 'compact',
          // outputStyle: 'nested',
          outputStyle: "expanded",
          precision: 10
        })
      )

      .pipe(sourcemaps.init())
      .pipe(
        autoprefixer({
          browsers: ["last 2 versions"],
          cascade: false
        })
      )
      .pipe(gulp.dest("css"))

      .pipe(rename({ suffix: ".min" }))
      .pipe(cleanCSS({ compatibility: "ie8" }))
      .pipe(gulp.dest("css"))
      .pipe(sourcemaps.write())
      /* Reload the browser CSS after every change */
      .pipe(reload({ stream: true }))
  );
}

function mergeFiles() {
  return (
    gulp
      .src([
        "css/vendor/bootstrap.min.css",
        "css/vendor/animate.css",
        "css/vendor/icomoon.css",
        "css/vendor/owl.carousel.min.css",
        "css/vendor/owl.theme.default.min.css",
        "css/style.css"
      ])
      // .pipe(sourcemaps.init())
      // .pipe(autoprefixer({
      //     browsers: ['last 2 versions'],
      //     cascade: false
      // }))
      .pipe(concat("styles-merged.css"))
      .pipe(gulp.dest("css"))
      .pipe(rename({ suffix: ".min" }))
      //   .pipe(cleanCSS({ compatibility: "ie8" }))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("css"))
      .pipe(reload({ stream: true }))
  );
}

function watchFiles() {
  gulp.watch("./img/*", imagesFunc);
  gulp.watch("js/custom.js", minifyCustom);
  gulp.watch(["scss/*.scss", "scss/**/*.scss"], minifyCustom);
}

gulp.task(
  "start",
  gulp.series(
    // scripts,
    minifySass,
    minifyCustom,
    mergeFiles
    // watchFiles
  )
);
