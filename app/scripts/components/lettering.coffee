angular.module('App.Filters')

.filter('lettering', () ->
  (text) ->
    if text?
      text = Array.prototype.map.call text, (character, index) ->
        "<span class='char-#{index}'>#{character}</span>"
      return text.join('')

)
