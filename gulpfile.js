const gulp = require('gulp');
const gulpInlineNg2Template = require('gulp-inline-ng2-template');
const htmlMin = require('html-minifier');
const gulpSass = require('gulp-sass');
const gulpAutoPrefix = require('gulp-autoprefixer');
const gulpCssMin = require('gulp-cssmin');
const gulpConcat = require('gulp-concat');
const gulpSourceMap = require('gulp-sourcemaps');


gulp.task('copyFonts', function () {
    gulp.src('./src/assets/fonts/angular-ui/fonts/**.*').pipe(gulp.dest('./bundles/fonts/'));
    gulp.src('./src/assets/**/*').pipe(gulp.dest('./bundles/assets/'));
});

gulp.task('tsCompile', function () {
    return gulp.src('./src/modules/**/*.ts')
        .pipe(gulpInlineNg2Template({
        useRelativePaths: true,
        templateProcessor(path, ext, file, cb) {
            try {
                let minifiedFile = htmlMin.minify(file, {
                    collapseWhitespace: true,
                    caseSensitive: true,
                    removeComments: true,
                    removeRedundantAttributes: true
                });
                cb(null, minifiedFile);
            }
            catch (err) {
                cb(err);
            }
        }
    })).pipe(gulp.dest('./bundles/'));
});
gulp.task('baseScss', ['copyFonts'], function () {
    return gulp.src(['./src/assets/scss/index.scss', './src/assets/fonts/angular-ui/style.css', './node_modules/normalize.css/normalize.css'])
        .pipe(gulpSourceMap.init())
        .pipe(gulpSass())
        .pipe(gulpAutoPrefix())
        .pipe(gulpConcat({
            path: require('./package.json').name + '.min.css'
        }))
        .pipe(gulpCssMin())
        .pipe(gulpSourceMap.write('./maps'))
        .pipe(gulp.dest('./bundles'));
});
//
gulp.task('nativeScss', ['copyFonts'], function () {
    return gulp.src(['./src/assets/scss/native-index.scss'])
        .pipe(gulpSourceMap.init())
        .pipe(gulpSass())
        .pipe(gulpAutoPrefix())
        .pipe(gulpConcat({
            path: require('./package.json').name + '-native.min.css'
        }))
        .pipe(gulpCssMin())
        .pipe(gulpSourceMap.write('./maps'))
        .pipe(gulp.dest('./bundles'));
});

gulp.task('default', ['tsCompile', 'baseScss', 'nativeScss']);