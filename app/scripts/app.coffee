dependencies = [
  'ngAnimate'
  'ngSanitize'
  'App.Models'
  'App.Services'
  'App.Directives'
  'App.Filters'
]

# Define all our modules
angular.module('App.Models', [])
angular.module('App.Directives', ['App.Models'])
angular.module('App.Services', [])
angular.module('App.Filters', [])
angular.module('App', dependencies)

# Set an app-wide constant for pagination
.constant('pageSize', 9)

# Build the main game controller
.controller('GameController', ($scope, connections, profile, Deck, Card, pageSize) ->
  
  $scope.decks = 
    current: null

  # Get profile information
  profile.get().then (user) -> $scope.user = user

  # After connections are pulled, set the deck
  setDeck = (selection) ->
    $scope.decks.current = new Deck(selection.map (connection) -> new Card(connection))

  # Load up the initial group of connections
  connections.page().then setDeck

  # Load the next group of connections
  $scope.next = -> connections.nextPage().then setDeck

  # If there are less connections than a full page, hide the next button
  $scope.pageSize = pageSize - 1

  # Create the saved gameState that is used in all the card components
  $scope.gameState = 
    matches: []

  # Toggle the scoresheet
  $scope.showScores = false

  # Find a given card for a match
  $scope.cardify = (match) -> Card.find(match[0].id)

  # Utility properties for easier gameState use
  Object.defineProperties $scope.gameState, 
    last:
      get: -> @matches[@matches.length - 1]
    completeMatches:
      get: -> @matches.filter((match) -> match.length > 1)
    score:
      get: -> @matches.filter((match) -> match.length > 1).length
)
