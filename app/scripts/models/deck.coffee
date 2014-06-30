angular.module('App.Models')

# Represents a set of matching-pair cards
.factory 'Deck', (utils, $rootScope) ->

  class Deck
    
    constructor: (cards) ->
      @_all     = []
      @names    = []
      @pictures = []

      @pushAll(cards) if cards?

    push: (card) ->

      return unless card? and card.picture and card.name
      # Add a name card
      @names.push
        type: 'name'
        id: card.id
        name: card.name
        title: card.title

      # Add a picture card
      @pictures.push
        type: 'picture'
        id: card.id
        picture: card.picture

      return this

    pushAll: (cards) ->
      @push(card) for card in cards

    reshuffle: ->
      @all reshuffle: true

    all: (options = {reshuffle: false}) ->
      {reshuffle} = options

      # Return cached unless asked to reshuffle, or there isn't anything in the cache
      return @_all unless reshuffle or @_all.length is 0

      # Make deep copies of the name cards and the pictures cards, then shuffle
      @_all = angular.copy(@names).concat(angular.copy(@pictures))
      @_all = utils.shuffle(@_all)
