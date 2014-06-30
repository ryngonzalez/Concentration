{ensureAuth, goPlay} = require './server/utils'
express              = require 'express'

app = express()

# Setup the app
require('./server/config')(app)
require('./server/login')(app)
require('./server/api')(app)

# Login screen and landing page
app.get '/', goPlay, (req, res) ->
  res.sendfile(__dirname + '/server/build/login.html')

# Game screens
app.get '/play', ensureAuth, (req, res) ->
  res.sendfile(__dirname + '/server/build/play.html')

if not module.parent
  app.listen(process.env.PORT or 3000)

module.exports = app
