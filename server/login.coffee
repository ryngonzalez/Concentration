passport = require 'passport'

module.exports = (app) ->

  # Start the login process via LinkedIn's OAuth
  app.get '/login', passport.authenticate('linkedin', {state: 'SOMESTATE'})

  # Setup the callback url that will be visited when LinkedIn authentication resolves or rejects
  app.get '/login/callback', passport.authenticate('linkedin', {failureRedirect: '/login/error'}), (req, res) ->
    res.redirect('/play')

  # If the login errors, show a handy page
  app.get '/login/error', (req, res) ->
    res.sendfile(__dirname + '/build/error.html')

  # Setup a logout redirect that ends the session
  app.get '/logout', (req, res) ->
    req.logout()
    res.redirect('/')

