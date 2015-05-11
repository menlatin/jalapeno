'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    bcrypt = require('co-bcrypt'), // https://github.com/sindresorhus/gulp-mocha/issues/86
                                   // - fixes issue where 2nd run of 'mocha' on watch causes
                                   //   "Module did not self-register" error in 'gulp-mocha-co'
    mocha = require('gulp-mocha-co'),
    exit = require('gulp-exit'),
    watch = require('gulp-watch');

gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        env: {
            'NODE_ENV': 'development',
            'PORT': 8000
        },
        nodeArgs: ['--debug=9999', '--harmony']
    }).on('restart');
});

gulp.task('watch', function() {
    gulp.watch(
        ['*.js', 'api/*.js', 'test/*.js'], // files to watch
        { read: true },
        ['mocha'] // tasks to run when above files change
    )
});

gulp.task('mocha', function() {
    process.env.NODE_ENV = 'test';
    process.env.PORT = 8001;
    gulp.src(['test/*.js'])
        .pipe(mocha({
            reporter: 'nyan'
        }))
        .on('error', function(err) {
            console.log("gulp 'mocha' task error: ", err.toString());
            this.emit('end'); // Gracefully continue without exiting process if test fails
        });
});

gulp.task('test-once', function() {
    gulp.tasks.mocha.fn().pipe(exit());
});

gulp.task('default', ['nodemon', 'mocha', 'watch']);