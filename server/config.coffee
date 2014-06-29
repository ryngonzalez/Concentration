express  = require 'express'
session  = require 'express-session'
passport = require 'passport'
LinkedIn = require 'passport-linkedin-oauth2'

module.exports = (app) ->

  # Configure the express app
  app.use express.static(__dirname + '/build')
  app.use session {secret: 'j12akje1dkals23jla0sd53'}
  app.use passport.initialize()
  app.use passport.session()

  # Set up dummy handlers for user serialization
  serializeHandler = (user, done) -> done(null, user)
  passport.serializeUser serializeHandler
  passport.deserializeUser serializeHandler

  # Construct the callback url for the given environment
  url = if app.get('env') is 'development'
    'http://localhost:3000'
  else
    'http://concentration.herokuapp.com'

  # Setup and use the strategy
  linkedinConfig =
    scope:             ['r_basicprofile', 'r_network']
    callbackURL:       url + '/login/callback'
    clientID:          process.env.LINKEDIN_KEY or '778xx5cmx3pzwe' 
    clientSecret:      process.env.LINKEDIN_SECRET or 'SKZacepcAvGsSoYj'
    passReqToCallback: true

  strategy = new LinkedIn.Strategy linkedinConfig, (req, token, secret, profile, done) ->

    # Set token in session for API use
    req.session.token = token
    done(null, profile)

  passport.use strategy
