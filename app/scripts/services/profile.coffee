angular.module('App.Services')

.service 'profile', ($http) ->
  return {
    get: ->
      $http
        method: 'GET'
        url: location.origin + '/api/profile'
      .then (response) ->
        {firstName, lastName, headline, pictureUrl} = response.data?.user?._json
        {firstName, lastName, headline, pictureUrl}
  }
