'use strict';

var gulp = require('gulp');

gulp.paths = {
    src: 'src',
    bower: 'src/bower_components',
    tmp: 'src/.tmp',
    srcImages: 'src/images',
    srcSass: 'src/sass',
    srcCss: 'src/css',
    srcJs: 'src/js',
    srcLibJs: 'src/lib_js',
    templates: 'templates',
    destStatic: 'static',
    destImages: 'static/resources/images',
    destFonts: 'templates/fonts',
    destCss: 'templates/css',
    destJs: 'templates/js'
};

require('require-dir')('./gulp');

gulp.task('build', ['clean'], function () {
    gulp.start('buildapp');
});


