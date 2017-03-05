var gulp = require('gulp');

gulp.task('migrate-bootstrap-files', function() {
    gulp.src('node_modules/bootstrap/dist/js/**').pipe(gulp.dest('dist/js'));
    gulp.src('node_modules/bootstrap/dist/fonts/**').pipe(gulp.dest('dist/fonts'));
    gulp.src('images/**').pipe(gulp.dest('dist/images'));
    return gulp.src('css/bootswatch-spacelab-theme.min.css').pipe(gulp.dest('dist/css'));
});

gulp.task('dev', function() {
    return gulp.src('node_modules/bootstrap/dist/js/**').pipe(gulp.dest('js'));
});

gulp.task('default', ['migrate-bootstrap-files'], function() {})