(function() {
  var dependencies;

  dependencies = ['ngAnimate', 'ngSanitize', 'App.Models', 'App.Services', 'App.Directives', 'App.Filters'];

  angular.module('App.Directives', []);

  angular.module('App.Services', []);

  angular.module('App.Filters', []);

  angular.module('App.Models', []);

  angular.module('App', dependencies).controller('GameController', function($scope, connections, Deck, Card) {
    console.log('Loaded game controller');
    window.connections = connections;
    $scope.decks = {
      current: null
    };
    connections.page().then(function(selection) {
      return $scope.decks.current = new Deck(selection.map(function(connection) {
        return new Card(connection);
      }));
    });
    $scope.gameState = {
      matches: []
    };
    return Object.defineProperties($scope.gameState, {
      last: {
        get: function() {
          return this.matches[this.matches.length - 1];
        }
      },
      score: {
        get: function() {
          return this.matches.filter(function(match) {
            return match.length > 1;
          }).length;
        }
      }
    });
  });

}).call(this);

(function() {
  angular.module('App.Models').factory('Card', function() {
    var Card;
    return Card = (function() {
      function Card(connection) {
        var firstName, headline, lastName, pictureUrl;
        this.id = connection.id, firstName = connection.firstName, lastName = connection.lastName, pictureUrl = connection.pictureUrl, headline = connection.headline;
        this.name = "" + firstName + " " + lastName;
        this.picture = pictureUrl;
        this.title = headline;
      }

      return Card;

    })();
  });

}).call(this);

(function() {
  angular.module('App.Models').factory('Deck', function(utils, $rootScope) {
    var Deck;
    return Deck = (function() {
      function Deck(cards) {
        this._all = [];
        this.names = [];
        this.pictures = [];
        if (cards != null) {
          this.pushAll(cards);
        }
      }

      Deck.prototype.push = function(card) {
        if (!((card != null) && card.picture && card.name)) {
          return;
        }
        this.names.push({
          type: 'name',
          id: card.id,
          name: card.name,
          title: card.title
        });
        this.pictures.push({
          type: 'picture',
          id: card.id,
          picture: card.picture
        });
        return this;
      };

      Deck.prototype.pushAll = function(cards) {
        var card, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cards.length; _i < _len; _i++) {
          card = cards[_i];
          _results.push(this.push(card));
        }
        return _results;
      };

      Deck.prototype.reshuffle = function() {
        return this.all({
          reshuffle: true
        });
      };

      Deck.prototype.all = function(options) {
        var reshuffle;
        if (options == null) {
          options = {
            reshuffle: false
          };
        }
        reshuffle = options.reshuffle;
        if (!(reshuffle || this._all.length === 0)) {
          return this._all;
        }
        this._all = angular.copy(this.names).concat(angular.copy(this.pictures));
        return this._all = utils.shuffle(this._all);
      };

      return Deck;

    })();
  });

}).call(this);

(function() {
  angular.module('App.Services').service('connections', function($http, $q, $rootScope) {
    var connections;
    connections = null;
    return {
      pageNum: 1,
      get: function(options) {
        var deferred, refresh;
        if (options == null) {
          options = {
            refresh: false
          };
        }
        refresh = options.refresh;
        deferred = $q.defer();
        if ((connections != null) && !options.refresh) {
          deferred.resolve(connections);
        } else {
          $http({
            method: 'GET',
            url: location.origin + '/api/connections'
          }).then(function(response) {
            connections = response.data;
            return deferred.resolve(connections);
          }, function(error) {
            return deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      refresh: function() {
        return this.get({
          refresh: true
        });
      },
      nextPage: function() {
        this.pageNum += 1;
        return this.page({
          pageSize: 9,
          pageNum: this.pageNum
        });
      },
      page: function(options) {
        var pageNum, pageSize;
        if (options == null) {
          options = {
            pageSize: 9,
            pageNum: 1
          };
        }
        pageSize = options.pageSize, pageNum = options.pageNum;
        if (pageNum < 1) {
          throw new Error('pageNum must be greater than 1');
        }
        return this.get().then(function(_arg) {
          var end, start, values;
          values = _arg.values;
          start = pageSize * (pageNum - 1);
          end = pageSize * pageNum;
          return values.slice(start, end);
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('App.Services').service('utils', function() {
    if (typeof _ === "undefined" || _ === null) {
      throw new Error('Lodash or Underscore must be loaded.');
    }
    return _;
  });

}).call(this);

(function() {
  angular.module('App.Directives').directive('card', function($http, utils, $q, $rootScope) {
    var Animation;
    Animation = (function() {
      function Animation(element, duration, tween) {
        this.duration = duration;
        this.tween = tween;
        this.deferred = null;
        this._animationID = null;
        this.element = angular.element(element);
      }

      Animation.prototype.start = function() {
        if (this._animationID != null) {
          cancelAnimationFrame(this._animationID);
        }
        this.startTime = Date.now();
        this.deferred = $q.defer();
        requestAnimationFrame(this._animate.bind(this));
        return this.deferred.promise;
      };

      Animation.prototype._animate = function() {
        var diff, now, percent;
        now = Date.now();
        diff = now - this.startTime;
        if (diff < this.duration) {
          percent = diff / this.duration;
          this.element.css('-webkit-transform', "rotateY(" + (this.tween.at(percent)) + "deg)");
          return this._animationID = requestAnimationFrame(this._animate.bind(this));
        } else {
          if (this.deferred != null) {
            this.deferred.resolve("" + this._animationID + " completed");
            this.deferred = null;
          }
          cancelAnimationFrame(this._animationID);
          this._animationID = null;
          return this.startTime = null;
        }
      };

      return Animation;

    })();
    return {
      restrict: 'E',
      template: "<div class=\"card-container\" ng-class=\"[color, set == true ? 'set' : '']\">\n  <div class=\"face front\" ng-class=\"card.type\">\n    <img ng-if=\"card.picture\" ng-src=\"{{card.picture}}\" alt=\"\">\n    <h4 class=\"name\" ng-if=\"card.name\" ng-bind=\"card.name\"></h4>\n    <p class=\"title\" ng-if=\"card.title\" ng-bind=\"card.title\"></p>\n  </div>\n  <div class=\"face back\">\n    <h2>C</h2>\n  </div>\n</div>",
      replace: true,
      scope: {
        card: '=info',
        gameState: '=state'
      },
      link: function(scope, element, attrs) {
        var back, flipToBack, flipToFront, flipped, front;
        scope.color = utils.sample(['blue', 'red', 'green']);
        flipped = true;
        scope.set = false;
        back = new TweenMachine(180, 0);
        back.easing('Elastic.Out').interpolation('Bezier');
        flipToBack = new Animation(element[0], 800, back);
        front = new TweenMachine(0, 180);
        front.easing('Elastic.Out').interpolation('Bezier');
        flipToFront = new Animation(element[0], 800, front);
        scope.$on('resetCards', function(e, card) {
          if (card === scope.card) {
            flipToBack.start();
            return flipped = true;
          }
        });
        scope.$on('setMatch', function(e, card) {
          if (card === scope.card) {
            return scope.set = true;
          }
        });
        return element.on('click', function() {
          return scope.$apply(function() {
            if (scope.set) {
              return;
            }
            if (flipped) {
              flipped = false;
              return flipToFront.start().then(function() {
                var openCard, _ref;
                if (((_ref = scope.gameState.last) != null ? _ref.length : void 0) > 1 || scope.gameState.matches.length === 0) {
                  return scope.gameState.matches.push([scope.card]);
                } else {
                  if (scope.gameState.last[0].id === scope.card.id) {
                    openCard = scope.gameState.last[0];
                    scope.gameState.last.push(scope.card);
                    $rootScope.$broadcast('setMatch', openCard);
                    return scope.set = true;
                  } else {
                    openCard = scope.gameState.matches.pop()[0];
                    $rootScope.$broadcast('resetCards', openCard);
                    flipToBack.start();
                    return flipped = true;
                  }
                }
              });
            } else {
              flipped = true;
              return flipToBack.start();
            }
          });
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('App.Filters').filter('lettering', function() {
    return function(text) {
      if (text != null) {
        text = Array.prototype.map.call(text, function(character, index) {
          return "<span class='char-" + index + "'>" + character + "</span>";
        });
        return text.join('');
      }
    };
  });

}).call(this);