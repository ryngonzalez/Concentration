angular.module('App.Services')

# Manages the connections from linkedin, handles pagination
.service 'connections', ($http, pageSize) ->

  # simple cache
  connections = null

  return {
    pageNum: 1

    get: (options) ->
      {start, count} = options

      # Make a request to our api server
      $http
        method: 'GET'
        url: location.origin + '/api/connections'
        params: {start, count} if start? and count?
      .then (response) ->
        # Cache the connections
        connections = response.data

    # Get the next page of connections
    nextPage: ->
      @pageNum += 1
      @page({pageSize: pageSize, pageNum: @pageNum})

    # Get a given page of results, given a page size and page number
    page: (options = {pageSize: pageSize, pageNum: 1}) ->
      {pageSize, pageNum} = options

      # Pagination must start from first item
      throw new Error 'pageNum must be greater than 1' if pageNum < 1
      
      # Get the values, and then partition it
      start = pageSize * (pageNum - 1)
      end   = pageSize * pageNum

      @get({start,count: pageSize}).then ({values}) -> values
  }

