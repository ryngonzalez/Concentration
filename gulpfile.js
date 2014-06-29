var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    cssmin        = require('gulp-cssmin'),
    coffee        = require('gulp-coffee'),
    concat        = require('gulp-concat'),
    bowerFiles    = require('gulp-bower-files'),
    templateCache = require('gulp-angular-templatecache');

function onError(err) {
  console.log(err);
  console.log(err.stack);
}

function prefix(path) {
  return 'server/build' + path;
}

gulp.task('assets', function(){
  return gulp.src('app/assets/**/*')
             .pipe(gulp.dest(prefix('app/assets')));
});

gulp.task('scss', function(){
  return gulp.src('app/styles/**/*.scss')
             .pipe(sass({onError: onError}))
             .pipe(concat('app.css'))
             .pipe(cssmin())
             .pipe(gulp.dest(prefix('/styles')));
});

gulp.task('templates', function(){
  // Main index file
  var stream = gulp.src('app/*.html')
                   .pipe(gulp.dest(prefix('/')));

  // Angular Templates
  gulp.src('app/templates/**/*.html')
      .pipe(templateCache({standalone: true})).on('error', onError)
      .pipe(gulp.dest(prefix('/scripts')));
  
  return stream;
});

gulp.task('scripts', function(){
  gulp.src('app/lib/**')
      .pipe(gulp.dest(prefix('/scripts/lib')));

  var files = [
    'app/scripts/*.coffee',
    'app/scripts/models/*.coffee',
    'app/scripts/services/*.coffee',
    'app/scripts/components/*.coffee'
  ];

  return gulp.src(files)
             .pipe(coffee()).on('error', onError)
             .pipe(concat('app.js'))
             .pipe(gulp.dest(prefix('/scripts')));
});

gulp.task('bower-files', function(){
  return bowerFiles().pipe(gulp.dest(prefix('/scripts/lib')));
});

gulp.task('build', [
  'scss', 
  'templates',
  'scripts',
  'assets',
  'bower-files'
]);

gulp.task('watch', function(){
  return gulp.watch([
    'app/*.html', 
    'app/lib/*.js',
    'app/templates/**/*.html',
    'app/scripts/**/*.coffee',
    'app/styles/**/*.scss',
    'bower_components/**'
  ], ['build']);
});

gulp.task('default', ['watch']);
