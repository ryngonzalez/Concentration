{ensureAuth}  = require './utils'
express       = require 'express'
request       = require 'request'
qs            = require 'querystring'

URL = 'https://api.linkedin.com/v1'

module.exports = (app) ->
  apiRouter = express.Router()
  
  # Make default query params factory
  base = (req) ->
    return {
      format: 'json',
      oauth2_access_token: req.session.token
    }

  # All API calls need to be authed
  apiRouter.use ensureAuth

  # Get all 1st degree connections for the current user
  apiRouter.get '/connections', (req, res) ->
    {start, count} = req.query
    query = base(req)
    
    # See if we want pagination
    query.start = start if start?
    query.count = count if count?

    request("#{URL}/people/~/connections", qs: query).pipe(res)

  # I originally wanted this endpoint for nicer images; linkedin's rate-limiting
  # and also the performance hit needed to make the multiple requests needed to use
  # this was prohibitive. Leaving this here for documentation.
  # 
  # apiRouter.get '/profile_images/:id', (req, res) ->
  #   request("#{URL}/people/#{req.params.id}/picture-urls::(original)", qs: base(req)).pipe(res)

  # Get profile information
  apiRouter.get '/profile', (req, res) ->
    res.send({user: req.user})

  # Mount API routes
  app.use '/api', apiRouter

