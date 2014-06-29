angular.module('App.Services')

.service 'utils', ->
  throw new Error 'Lodash or Underscore must be loaded.' unless _?
  return _

