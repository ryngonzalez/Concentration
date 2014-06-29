dependencies = [
  'ngAnimate'
  'App.Models'
  'App.Services'
  'App.Directives'
]

angular.module('App.Directives', [])
angular.module('App.Services', [])
angular.module('App.Models', [])
angular.module('App', dependencies)

.controller('GameController', ($scope, connections, Deck, Card) ->
  console.log 'Loaded game controller'
  window.connections = connections
  
  $scope.decks = 
    current: null

  connections.page().then (selection) ->
    $scope.decks.current = new Deck(selection.map (connection) ->
      new Card(connection)
    )
    
)
