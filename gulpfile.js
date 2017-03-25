'use strict';


const page = ['index'];

// Define Gulp Plugins

const   gulp = require('gulp'),
        del = require('del'),
        mergeJson = require('gulp-merge-json'),
        browserSync = require('browser-sync').create(),
        reload = browserSync.reload,
        pug = require('gulp-pug'),
        fileSystem = require('fs'),
        yaml = require('gulp-yaml'),
        sass = require('gulp-sass'),
        sassGlob = require('gulp-sass-glob'),
        plumber = require('gulp-plumber'),
        uglify = require('gulp-uglify'),
        gulpSequence = require('gulp-sequence'),
        autoprefixer = require('gulp-autoprefixer'),
        minify = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        sourcemaps = require('gulp-sourcemaps'),
        prettify = require('gulp-html-prettify'),
        imagemin = require('gulp-imagemin'),
        googleWebFonts = require('gulp-google-webfonts'),
        minifyJs = require('gulp-minify');

// Brower sync
gulp.task('browser-sync', function () {
    return browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

// Clean
gulp.task('clean', function () {
    return del(['dist']);
});


// Build styles

gulp.task('styles', function () {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 1',
        'ie_mob >= 1',
        'ff >= 1',
        'chrome >= 1',
        'safari >= 1',
        'opera >= 1',
        'ios >= 1',
        'android >= 1',
        'bb >= 1'
    ];
    return gulp
        .src('app/styles/main.scss')
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS,
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(minify())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream: true}));
});


// Build HTML

gulp.task('yaml-json', function () {
    return gulp.src(['app/**/*.yml'])
        .pipe(plumber())
        .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
        .pipe(mergeJson({
            fileName: 'data.json',
            json5: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('views', function () {
    const data = JSON.parse(fileSystem.readFileSync('.tmp/data.json'));
    return gulp.src('app/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true, locals: data}))
        .pipe(prettify(options.htmlPrettify))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});

gulp.task('views-only', function (done) {
    const data = JSON.parse(fileSystem.readFileSync('.tmp/data.json'));
    const pathPage = [];
    for (var i = 0; i < page.length; i++) {
        pathPage.push("app/" + page[i] + '.pug');
    }
    console.log(pathPage);
    gulp.src(pathPage)
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            locals: data
        }))
        .pipe(plumber.stop())
        .pipe(prettify(options.htmlPrettify))
        .pipe(gulp.dest('dist'))
        .on('end', done)
});

const options = {
    htmlPrettify: {
        'indent_size': 4,
        'unformatted': ['pre', 'code'],
        'indent_with_tabs': false,
        'preserve_newlines': true,
        'brace_style': 'expand',
        'end_with_newline': true,
        'indent_char': ' ',
        'space_before_conditional': true,
        'wrap_attributes': 'auto'
    }
};

gulp.task('html', function (cb) {
    return gulpSequence(
        'yaml-json',
        'views',
        cb
    );
});

gulp.task('html-only', function (cb) {
    return gulpSequence(
        'yaml-json',
        'views-only',
        cb
    );
});

//Move lib bower
gulp.task('cleanlib', function () {
    return del(['dist/vendor/*']);
});
gulp.task('movelib', ['cleanlib'], function (cb) {
    return gulpSequence(
        'move-library',
        'move-extends',
        cb
    );
});

gulp.task('move-library', function () {
    gulp.src(['bower_components/*/**'])
        .pipe(gulp.dest('dist/vendor/'));
});

gulp.task('move-extends', function () {
    gulp.src('app/vendor/*/**')
        .pipe(gulp.dest('dist/vendor'));
});

//Compine fonts
var fontOptions = {
};
gulp.task('fonts', function () {
    del(['dist/fonts']);
    return gulp.src('app/fonts/fonts.list')
        .pipe(googleWebFonts(fontOptions))
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function(cb) {
    gulp.src(['app/images/**/*'])
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 1,
            progressive: true,
            interlaced: true
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});

//Build js
gulp.task('js', function () {
    return gulp.src(['app/javascripts/**/*.js', "!app/scripts/plugins-compressed.js", "!app/scripts/theme-function.js"])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(minifyJs({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/js'));
});

//Watch files

gulp.task('watch', function () {

    // Watch .pug files
    gulp.watch(
        ['app/layouts/*.pug', 'app/layouts/**/*.pug', 'app/layouts/**/*.yml', 'app/*.pug'],
        ['html-only', browserSync.reload]
    );

    // Watch .scss files
    gulp.watch(['app/**/*.scss', 'app/*/**/*.scss'], ['styles']);

    // Watch .js files
    gulp.watch('app/javascripts/**/*.js', ['js', browserSync.reload]);

    // Watch image files
    gulp.watch('app/images/**/*', ['images', browserSync.reload]);

});

// Run Tasks

gulp.task('build-dev', function (cb) {
    return gulpSequence(
        'clean', 'movelib', 'styles', 'fonts', 'images', 'js', 'html',
        cb
    );
});

gulp.task('dev', function (cb) {
    return gulpSequence(
        'build-dev',
        'watch',
        'browser-sync',
        cb
    );
});