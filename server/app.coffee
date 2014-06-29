{ensureAuth, goPlay} = require './utils'
express              = require 'express'

app = express()

# Setup the app
require('./config')(app)
require('./login')(app)
require('./api')(app)

# Login screen and landing page
app.get '/', goPlay, (req, res) ->
  res.sendfile(__dirname + '/build/login.html')

# Game screens
app.get '/play', ensureAuth, (req, res) ->
  res.sendfile(__dirname + '/build/play.html')

app.listen(3000)
