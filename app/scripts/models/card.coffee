angular.module('App.Models')

# Card model. Used for representing a connection in the app
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

    # Convenience method for finding a card by id
    @find = (id) ->
      Card.cards[id]


