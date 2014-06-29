module.exports =
  ensureAuth: (req, res, next) ->
    return next() if req.isAuthenticated()
    res.redirect('/')

  goPlay: (req, res, next) ->
    return next() unless req.isAuthenticated()
    res.redirect('/play')
