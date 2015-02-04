var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var scsslint = require('gulp-scss-lint');
var myth = require('gulp-myth');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');

gulp.task('dev-css', function () {
	sass('./styles/scss/index.scss', { sourcemap: true })
		.on('error', function (err) { console.log(err.message); })
		.pipe(myth())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./styles/css'))
		.pipe(livereload());
});

gulp.task('dist-css', function () {
	sass('./styles/scss/index.scss', { sourcemap: true, stopOnError: true })
		.on('error', function (err) { console.log(err.message); })
		.pipe(myth({compress: true}))
		.pipe(sourcemaps.write())
		.pipe(rename('index_' + Date.now() + '.css'))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('dev-lint', function () {
	gulp.src('./styles/scss/*.scss')
		.pipe(scsslint({
			'config': 'scss-lint.yml'
		}));
});

gulp.task('dist-lint', function () {
	gulp.src('./styles/scss/*.scss')
		.pipe(scsslint({
			'config': 'scss-lint.yml'
		}))
		.pipe(scsslint.failReporter());
});

gulp.task('dev', ['dev-lint', 'dev-css'], function () {
	livereload.listen();
	gulp.watch('./styles/scss/*.scss', ['dev-lint', 'dev-css']);
});

gulp.task('build', ['dist-lint', 'dist-css']);