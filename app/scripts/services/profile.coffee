angular.module('App.Services')

# Simple wrapper for contacting our api server for user info
.service 'profile', ($http) ->
  return {
    get: ->
      $http
        method: 'GET'
        url: location.origin + '/api/profile'
      .then (response) ->
        # Strip out the relevant info
        {firstName, lastName, headline, pictureUrl} = response.data?.user?._json
        {firstName, lastName, headline, pictureUrl}
  }
