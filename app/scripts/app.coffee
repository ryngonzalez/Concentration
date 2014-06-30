dependencies = [
  'ngAnimate'
  'ngSanitize'
  'App.Models'
  'App.Services'
  'App.Directives'
  'App.Filters'
]

angular.module('App.Directives', [])
angular.module('App.Services', [])
angular.module('App.Filters', [])
angular.module('App.Models', [])
angular.module('App', dependencies)

.controller('GameController', ($scope, connections, profile, Deck, Card) ->
  console.log 'Loaded game controller'
  window.connections = connections
  
  $scope.decks = 
    current: null

  profile.get().then (user) ->
    console.log user
    $scope.user = user

  connections.page().then (selection) ->
    $scope.decks.current = new Deck(selection.map (connection) ->
      new Card(connection)
    )

  $scope.gameState = 
    matches: []

  Object.defineProperties $scope.gameState, 
    last:
      get: -> @matches[@matches.length - 1]
    score:
      get: -> @matches.filter((match) -> match.length > 1).length
)
