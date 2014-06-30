var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    cssmin        = require('gulp-cssmin'),
    coffee        = require('gulp-coffee'),
    concat        = require('gulp-concat'),
    bowerFiles    = require('gulp-bower-files');

// Do something useful on error
function onError(err) {
  console.log(err);
  console.log(err.stack);
}

// Build a path with the correct destination prefix
function prefix(path) {
  return 'server/build' + path;
}

// Copy over assets to build folder
gulp.task('assets', function(){
  return gulp.src('app/assets/**/*')
             .pipe(gulp.dest(prefix('/assets')));
});

// Copy over styles to build folder
gulp.task('scss', function(){
  return gulp.src('app/styles/**/*.scss')
             .pipe(sass({onError: onError}))
             .pipe(concat('app.css'))
             .pipe(cssmin({keepBreaks: true}))
             .pipe(gulp.dest(prefix('/styles')));
});

// Copy html files to build folder
gulp.task('templates', function(){
  return gulp.src('app/*.html')
             .pipe(gulp.dest(prefix('/')));  
});

// Copy over scripts
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

// Copy bower dependencies
gulp.task('bower-files', function(){
  return bowerFiles().pipe(gulp.dest(prefix('/scripts/lib')));
});

// Build everything
gulp.task('build', [
  'scss', 
  'templates',
  'scripts',
  'assets',
  'bower-files'
]);

// Watch and build
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
