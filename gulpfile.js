const gulp = require('gulp');

gulp.task('copy', function () {
    gulp.src('./src/tanbo/ui-native/**/*').pipe(gulp.dest('./library/projects/tanbo/ui-native/src/'));
});

gulp.task('default', ['copy']);