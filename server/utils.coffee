module.exports =

  # Guard for authed requests
  ensureAuth: (req, res, next) ->
    return next() if req.isAuthenticated()
    res.redirect('/')

  # When authed, go play
  goPlay: (req, res, next) ->
    return next() unless req.isAuthenticated()
    res.redirect('/play')
