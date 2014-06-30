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

# Set the port for the given environment, accessible app-wide
if app.get('env') is 'development'
  app.set('port', 3000)
else
  app.set('port', process.env.PORT)

if not module.parent
  app.listen app.get('port')

module.exports = app
