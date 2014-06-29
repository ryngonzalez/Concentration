{ensureAuth}  = require './utils'
express       = require 'express'
request       = require 'request'
qs            = require 'querystring'

URL = 'https://api.linkedin.com/v1'

module.exports = (app) ->
  apiRouter = express.Router()
  
  # All API calls need to be authed
  apiRouter.use ensureAuth

  # Get all 1st degree connections for the current user
  apiRouter.get '/connections', (req, res) ->
    request(URL + '/people/~/connections?format=json', {
      qs: {oauth2_access_token: req.session.token}
    }).pipe(res)

  # We want large, nice pictures, so we'll expose an endpoint for them
  apiRouter.get '/profile_images/:id', (req, res) ->
    request(URL + "/people/#{req.params.id}/picture-urls::(original)?format=json", {
      qs: {oauth2_access_token: req.session.token}
    }).pipe(res)

  # Get profile information
  apiRouter.get '/profile', (req, res) ->
    res.send({user: req.user})

  # Mount API routes
  app.use '/api', apiRouter

