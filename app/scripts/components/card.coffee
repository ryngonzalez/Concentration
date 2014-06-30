angular.module('App.Directives')

.directive('card', ($http, utils) ->

  class Animation

    constructor: (element, @duration, @tween) ->
      @_animationID = null
      @element = angular.element(element)

    start: ->
      if @_animationID?
        cancelAnimationFrame @_animationID

      @startTime = Date.now()
      requestAnimationFrame @_animate.bind(this)

    _animate: ->
      now = Date.now()
      diff = (now - @startTime)
      if diff < @duration
        percent = diff/@duration
        @element.css('-webkit-transform', "rotateY(#{@tween.at(percent)}deg)")
        @_animationID = requestAnimationFrame @_animate.bind(this)
      else
        cancelAnimationFrame @_animationID
        @_animationID = null
        @startTime = null

  return {
    restrict: 'E'
    template: """
    <div class="card-container" ng-class="color">
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
    link: (scope, element, attrs) ->

      scope.color = utils.sample(['blue', 'red', 'green'])
      console.log scope.color

      # updated = false
      flipped = true

      back = new TweenMachine(180, 0)
      back.easing('Elastic.Out').interpolation('Bezier')
      flipToBack = new Animation(element[0], 800, back)

      front = new TweenMachine(0, 180)
      front.easing('Elastic.Out').interpolation('Bezier')
      flipToFront = new Animation(element[0], 800, front)
        
      element.on 'click', ->
        console.log 'clicked'
        if flipped
          flipToFront.start()
          flipped = false
        else
          flipToBack.start()
          flipped = true

        # return if updated or scope.card.type is 'name'
        # updated = true
        # $http
        #   method: 'GET'
        #   url: "#{location.origin}/api/profile_images/#{scope.card.id}"
        # .then (image) ->
        #   scope.card.picture = image.data.values[0]

  }
)
