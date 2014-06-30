angular.module('App.Services')

# Lodash adapter for angular's dependency injection
.service 'utils', ->
  throw new Error 'Lodash or Underscore must be loaded.' unless _?
  return _

