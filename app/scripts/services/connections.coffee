angular.module('App.Services')

.service 'connections', ($http, $q, $rootScope) ->

  connections = null

  return {
    pageNum: 1

    get: (options) ->
      {start, count} = options
      
      deferred = $q.defer()

      $http
        method: 'GET'
        url: location.origin + '/api/connections'
        params: {start, count} if start? and count?
      .then (response) ->
        connections = response.data
        console.log connections
        deferred.resolve connections
      , (error) ->
        deferred.reject error

      return deferred.promise

    refresh: ->
      @get refresh: true

    nextPage: ->
      @pageNum += 1
      @page({pageSize: 9, pageNum: @pageNum})

    page: (options = {pageSize: 9, pageNum: 1}) ->
      {pageSize, pageNum} = options

      # Pagination must start from first item
      throw new Error 'pageNum must be greater than 1' if pageNum < 1
      
      # Get the values, and then partition it
      start = pageSize * (pageNum - 1)
      end   = pageSize * pageNum

      @get({start,count: pageSize}).then ({values}) -> values
  }

