var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    coffee        = require('gulp-coffee'),
    concat        = require('gulp-concat'),
    bowerFiles    = require('gulp-bower-files'),
    templateCache = require('gulp-angular-templatecache');

function onError(err) {
  console.log(err);
  util.beep();
}

function prefix(path) {
  return 'build/' + path;
}

gulp.task('assets', function(){
  return gulp.src('app/assets/**/*')
             .pipe(gulp.dest(prefix('app/assets')));
});

gulp.task('scss', function(){
  return gulp.src('app/styles/**/*.scss')
             .pipe(sass()).on('error', onError)
             .pipe(concat('app.css'))
             .pipe(gulp.dest(prefix('app/styles')));
});

gulp.task('templates', function(){
  // Main index file
  var stream = gulp.src('app/*.html')
                   .pipe(gulp.dest(prefix('app')));

  // Angular Templates
  gulp.src('app/templates/**/*.html')
      .pipe(templateCache({standalone: true})).on('error', onError)
      .pipe(gulp.dest(prefix('app/scripts')));
  
  return stream;
});

gulp.task('scripts', function(){
  return gulp.src('app/scripts/**')
             .pipe(coffee()).on('error', onError)
             .pipe(concat('app.js'))
             .pipe(gulp.dest(prefix('app/scripts')));
});

gulp.task('bower-files', function(){
  return bowerFiles().pipe(gulp.dest(prefix('app/scripts/lib')));
});

gulp.task('watch', function(){
  return gulp.watch([
    'app/*.html', 
    'app/templates/**/*.html',
    'app/scripts/**/*.coffee',
    'app/styles/**/*.scss',
    'bower_components/**'
  ], ['build']);
});

gulp.task('build', [
  'scss', 
  'templates',
  'scripts',
  'assets',
  'bower-files'
]);


gulp.task('default', ['watch']);
