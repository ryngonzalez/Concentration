angular.module('App.Models')

.factory 'Card', ->

  class Card
    @cards = {}
    constructor: (connection) ->
      # Get relevant info from the connections
      {@id, firstName, lastName, pictureUrl, headline} = connection
      @name = "#{firstName} #{lastName}"
      @picture = pictureUrl
      @title = headline
      
      Card.cards[@id] = this

    @find = (id) ->
      Card.cards[id]


