angular.module('App.Directives')

.directive('card', (utils, $rootScope, Animation) ->

  return {
    restrict: 'E'
    template: """
    <div class="card-container" ng-class="[color, set == true ? 'set' : '']">
      <div class="face front" ng-class="card.type">
        <img ng-if="card.picture" ng-src="{{card.picture}}" alt="">
        <h4 class="name" ng-if="card.name" ng-bind="card.name"></h4>
        <p class="title" ng-if="card.title" ng-bind="card.title"></p>
      </div>
      <div class="face back">
        <h2>C</h2>
      </div>
    </div>
    """
    replace: true
    scope:
      card: '=info'
      gameState: '=state'
    link: (scope, element, attrs) ->

      # Pick a random color for the card
      scope.color = utils.sample(['blue', 'red', 'green'])

      # Set intial internal state of the card
      flipped = true
      scope.set = false

      # Build the animations for flipping
      back = new TweenMachine(180, 0)
      back.easing('Elastic.Out').interpolation('Bezier')
      flipToBack = new Animation(element[0], 800, back)

      front = new TweenMachine(0, 180)
      front.easing('Elastic.Out').interpolation('Bezier')
      flipToFront = new Animation(element[0], 800, front)

      # When an incorrect match is found, this event is dispatched,
      # and all cards that match the incorrectly opened card are closed
      scope.$on 'resetCards', (e, card) ->
        if card is scope.card
          flipToBack.start()
          flipped = true

      # When a correct match is found this event is dispatched,
      # and all cards the match the correctly opened card are set as a match
      scope.$on 'setMatch', (e, card) ->
        if card is scope.card
          scope.set = true

      element.on 'click', ->
        scope.$apply ->
          # Don't worry about cards that we're done with
          return if scope.set

          # Flip to the front (info) side
          if flipped
            flipped = false
            flipToFront.start().then ->

              # Push a single element array that could become a correct match
              if scope.gameState.last?.length > 1 or scope.gameState.matches.length is 0
                scope.gameState.matches.push [scope.card]
              else

                # The match as correct, and we set the cards as a match
                if scope.gameState.last[0].id is scope.card.id and scope.gameState.last[0] isnt scope.card.type
                  [openCard] = scope.gameState.last
                  scope.gameState.last.push scope.card
                  $rootScope.$broadcast 'setMatch', openCard
                  scope.set = true
                # The match was incorrect, and we close the cards
                else
                  [openCard] = scope.gameState.matches.pop()
                  $rootScope.$broadcast 'resetCards', openCard
                  flipToBack.start()
                  flipped = true
          # Flip to the back logo side
          else
            flipped = true
            flipToBack.start().then -> scope.gameState.matches.pop()

  }
)
