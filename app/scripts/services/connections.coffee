angular.module('App.Services')

.service 'connections', ($http, $q, $rootScope) ->

  connections = null

  return {
    pageNum: 1

    get: (options = {refresh: false}) ->
      {refresh} = options

      deferred = $q.defer()
      if connections? and not options.refresh
        deferred.resolve(connections)
      else      
        $http
          method: 'GET'
          url: location.origin + '/api/connections'
        .then (response) ->
          connections = response.data
          deferred.resolve connections
        , (error) ->
          deferred.reject error

      return deferred.promise

    refresh: ->
      @get refresh: true

    nextPage: ->
      @pageNum += 1
      @page({pageSize: 18, pageNum: @pageNum})

    page: (options = {pageSize: 18, pageNum: 1}) ->
      {pageSize, pageNum} = options

      # Pagination must start from first item
      throw new Error 'pageNum must be greater than 1' if pageNum < 1
      
      # Get the values, and then partition it
      @get().then ({values}) ->

        start = pageSize * (pageNum - 1)
        end   = pageSize * pageNum

        values[start...end]
  }

