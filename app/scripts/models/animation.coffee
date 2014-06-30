angular.module('App.Models')

.factory('Animation', ($q) ->
  # Wrapper for making my TweenMachine library useful for set-and-forget animations
  class Animation

    constructor: (element, @duration, @tween) ->
      @deferred = null
      @_animationID = null
      @element = angular.element(element)

    # Start an animation over a given duration and with a given tween
    # returns a promise that resolves when the animation completes
    start: ->
      if @_animationID?
        cancelAnimationFrame @_animationID

      @startTime = Date.now()
      @deferred = $q.defer()
      requestAnimationFrame @_animate.bind(this)

      return @deferred.promise

    # Looped animation for flipping a card
    _animate: ->
      now = Date.now()
      diff = (now - @startTime)
      if diff < @duration

        # Percent elapsed over the duration
        percent = diff/@duration

        # Perform the transformation
        @element.css({
          transform: "rotateY(#{@tween.at(percent)}deg)"
          "webkitTransform": "rotateY(#{@tween.at(percent)}deg)"
        })
        @_animationID = requestAnimationFrame @_animate.bind(this)
      else

        # Resolve the promise, and reset all the animation internal state
        if @deferred?
          @deferred.resolve("#{@_animationID} completed")
          @deferred = null

        cancelAnimationFrame @_animationID
        @_animationID = null
        @startTime = null
)
