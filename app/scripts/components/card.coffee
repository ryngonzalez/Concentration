angular.module('App.Directives')

.directive('card', ($http, utils, $q, $rootScope) ->

  class Animation

    constructor: (element, @duration, @tween) ->
      @deferred = null
      @_animationID = null
      @element = angular.element(element)

    start: ->
      if @_animationID?
        cancelAnimationFrame @_animationID

      @startTime = Date.now()
      @deferred = $q.defer()
      requestAnimationFrame @_animate.bind(this)

      return @deferred.promise

    _animate: ->
      now = Date.now()
      diff = (now - @startTime)
      if diff < @duration
        percent = diff/@duration
        @element.css('-webkit-transform', "rotateY(#{@tween.at(percent)}deg)")
        @_animationID = requestAnimationFrame @_animate.bind(this)
      else

        if @deferred?
          @deferred.resolve("#{@_animationID} completed")
          @deferred = null

        cancelAnimationFrame @_animationID
        @_animationID = null
        @startTime = null

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

      scope.color = utils.sample(['blue', 'red', 'green'])

      flipped = true
      scope.set = false

      back = new TweenMachine(180, 0)
      back.easing('Elastic.Out').interpolation('Bezier')
      flipToBack = new Animation(element[0], 800, back)

      front = new TweenMachine(0, 180)
      front.easing('Elastic.Out').interpolation('Bezier')
      flipToFront = new Animation(element[0], 800, front)

      scope.$on 'resetCards', (e, card) ->
        if card is scope.card
          flipToBack.start()
          flipped = true

      scope.$on 'setMatch', (e, card) ->
        if card is scope.card
          scope.set = true

      element.on 'click', ->
        scope.$apply ->
          return if scope.set
          if flipped
            flipped = false
            flipToFront.start().then ->
              if scope.gameState.last?.length > 1 or scope.gameState.matches.length is 0
                scope.gameState.matches.push [scope.card]
              else
                if scope.gameState.last[0].id is scope.card.id
                  [openCard] = scope.gameState.last
                  scope.gameState.last.push scope.card
                  $rootScope.$broadcast 'setMatch', openCard
                  scope.set = true
                else
                  [openCard] = scope.gameState.matches.pop()
                  $rootScope.$broadcast 'resetCards', openCard
                  flipToBack.start()
                  flipped = true
          else
            flipped = true
            flipToBack.start()

        # return if updated or scope.card.type is 'name'
        # updated = true
        # $http
        #   method: 'GET'
        #   url: "#{location.origin}/api/profile_images/#{scope.card.id}"
        # .then (image) ->
        #   scope.card.picture = image.data.values[0]

  }
)
