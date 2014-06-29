/*

TweenMachine
@property {Number | Array} start
@property {Number | Array} end
@property {TweenMachine.Easing} easing
@property {TweenMachine.Interpolation} interpolation
*/


(function() {
  var utils;

  this.TweenMachine = (function() {
    var clamp, isNumber;

    isNumber = function(candidate) {
      return !isNaN(parseFloat(candidate)) && isFinite(candidate);
    };

    clamp = function(lower, upper, value) {
      if (value < lower) {
        return lower;
      }
      if (value > upper) {
        return upper;
      }
      return value;
    };

    TweenMachine.tweens = [];

    TweenMachine.clear = function() {
      return TweenMachine.tweens.length = 0;
    };

    function TweenMachine(start, end) {
      this.start = start;
      this.end = end;
      if (isNumber(this.start) && isNumber(this.end)) {
        this.type = 'Numeric';
      }
      if (Array.isArray(this.start) && Array.isArray(this.end)) {
        this.type = 'Array';
      }
      if (this.type == null) {
        throw new Error('Must provide either numeric or Array start and end values.');
      }
      this.$id = TweenMachine.tweens.length;
      this.easer = TweenMachine.easings.Linear.None;
      this.interpolator = TweenMachine.interpolations.Linear;
      TweenMachine.tweens.push(this);
      return this;
    }

    TweenMachine.prototype.easing = function(name) {
      var category, type, _ref;
      _ref = name.split('.'), category = _ref[0], type = _ref[1];
      this.easer = TweenMachine.easings[category][type];
      return this;
    };

    TweenMachine.prototype.interpolation = function(name) {
      this.interpolator = TweenMachine.interpolations[name];
      return this;
    };

    TweenMachine.prototype.at = function(progress) {
      progress = clamp(0, 1, progress);
      switch (this.type) {
        case 'Numeric':
          return this.start + (this.end - this.start) * this.easer(progress);
        case 'Array':
          return this.interpolator(this.end, this.easer(progress));
      }
    };

    return TweenMachine;

  })();

  this.TweenMachine.easings = {
    Linear: {
      None: function(k) {
        return k;
      }
    },
    Quadratic: {
      In: function(k) {
        return k * k;
      },
      Out: function(k) {
        return k * (2 - k);
      },
      InOut: function(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k;
        }
        return -0.5 * (--k * (k - 2) - 1);
      }
    },
    Cubic: {
      In: function(k) {
        return k * k * k;
      },
      Out: function(k) {
        return --k * k * k + 1;
      },
      InOut: function(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k + 2);
      }
    },
    Quartic: {
      In: function(k) {
        return k * k * k * k;
      },
      Out: function(k) {
        return 1 - (--k * k * k * k);
      },
      InOut: function(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k * k;
        }
        return -0.5 * ((k -= 2) * k * k * k - 2);
      }
    },
    Quintic: {
      In: function(k) {
        return k * k * k * k * k;
      },
      Out: function(k) {
        return --k * k * k * k * k + 1;
      },
      InOut: function(k) {
        if ((k *= 2) < 1) {
          return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
      }
    },
    Sinusoidal: {
      In: function(k) {
        return 1 - Math.cos(k * Math.PI / 2);
      },
      Out: function(k) {
        return Math.sin(k * Math.PI / 2);
      },
      InOut: function(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }
    },
    Exponential: {
      In: function(k) {
        if (k === 0) {
          return 0;
        } else {
          return Math.pow(1024, k - 1);
        }
      },
      Out: function(k) {
        if (k === 1) {
          return 1;
        } else {
          return 1 - Math.pow(2, -10 * k);
        }
      },
      InOut: function(k) {
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        if ((k *= 2) < 1) {
          return 0.5 * Math.pow(1024, k - 1);
        }
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
      }
    },
    Circular: {
      In: function(k) {
        return 1 - Math.sqrt(1 - k * k);
      },
      Out: function(k) {
        return Math.sqrt(1 - (--k * k));
      },
      InOut: function(k) {
        if ((k *= 2) < 1) {
          return -0.5 * (Math.sqrt(1 - k * k) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
      }
    },
    Elastic: {
      In: function(k) {
        var a, p, s;
        s = void 0;
        a = 0.1;
        p = 0.4;
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        if (!a || a < 1) {
          a = 1;
          s = p / 4;
        } else {
          s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
      },
      Out: function(k) {
        var a, p, s;
        s = void 0;
        a = 0.1;
        p = 0.4;
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        if (!a || a < 1) {
          a = 1;
          s = p / 4;
        } else {
          s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
      },
      InOut: function(k) {
        var a, p, s;
        s = void 0;
        a = 0.1;
        p = 0.4;
        if (k === 0) {
          return 0;
        }
        if (k === 1) {
          return 1;
        }
        if (!a || a < 1) {
          a = 1;
          s = p / 4;
        } else {
          s = p * Math.asin(1 / a) / (2 * Math.PI);
        }
        if ((k *= 2) < 1) {
          return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        }
        return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
      }
    },
    Back: {
      In: function(k) {
        var s;
        s = 1.70158;
        return k * k * ((s + 1) * k - s);
      },
      Out: function(k) {
        var s;
        s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
      },
      InOut: function(k) {
        var s;
        s = 1.70158 * 1.525;
        if ((k *= 2) < 1) {
          return 0.5 * (k * k * ((s + 1) * k - s));
        }
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
      }
    },
    Bounce: {
      In: function(k) {
        return 1 - TweenMachine.easings.Bounce.Out(1 - k);
      },
      Out: function(k) {
        if (k < (1 / 2.75)) {
          return 7.5625 * k * k;
        } else if (k < (2 / 2.75)) {
          return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
        } else if (k < (2.5 / 2.75)) {
          return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
        } else {
          return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
        }
      },
      InOut: function(k) {
        if (k < 0.5) {
          return TweenMachine.easings.In(k * 2) * 0.5;
        }
        return TweenMachine.easings.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
      }
    }
  };

  utils = {
    Linear: function(p0, p1, t) {
      return (p1 - p0) * t + p0;
    },
    Bernstein: function(n, i) {
      var fc;
      fc = this.Factorial;
      return fc(n) / fc(i) / fc(n - i);
    },
    Factorial: (function(a) {
      return function(n) {
        var i, s;
        s = 1;
        i = void 0;
        if (a[n]) {
          return a[n];
        }
        i = n;
        while (i > 1) {
          s *= i;
          i--;
        }
        return a[n] = s;
      };
    })([1]),
    CatmullRom: function(p0, p1, p2, p3, t) {
      var t2, t3, v0, v1;
      v0 = (p2 - p0) * 0.5;
      v1 = (p3 - p1) * 0.5;
      t2 = t * t;
      t3 = t * t2;
      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }
  };

  this.TweenMachine.interpolations = {
    Linear: function(v, k) {
      var f, fn, i, m;
      m = v.length - 1;
      f = m * k;
      i = Math.floor(f);
      fn = utils.Linear;
      if (k < 0) {
        return fn(v[0], v[1], f);
      }
      if (k > 1) {
        return fn(v[m], v[m - 1], m - f);
      }
      return fn(v[i], v[(i + 1 > m ? m : i + 1)], f - i);
    },
    Bezier: function(v, k) {
      var b, bn, i, n, pw;
      b = 0;
      n = v.length - 1;
      pw = Math.pow;
      bn = utils.Bernstein;
      i = void 0;
      i = 0;
      while (i <= n) {
        b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        i++;
      }
      return b;
    },
    CatmullRom: function(v, k) {
      var f, fn, i, m;
      m = v.length - 1;
      f = m * k;
      i = Math.floor(f);
      fn = utils.CatmullRom;
      if (v[0] === v[m]) {
        if (k < 0) {
          i = Math.floor(f = m * (1 + k));
        }
        return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
      } else {
        if (k < 0) {
          return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
        }
        if (k > 1) {
          return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
        }
        return fn(v[(i ? i - 1 : 0)], v[i], v[(m < i + 1 ? m : i + 1)], v[(m < i + 2 ? m : i + 2)], f - i);
      }
    }
  };

}).call(this);
