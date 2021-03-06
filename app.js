var express = require('express')
var processImage = require('express-processimage')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var config = require('./config')

var settings = require('./routes/settings')
var users = require('./routes/users')
var dashboard = require('./routes/dashboard')
var files = require('./routes/files')
var templates = require('./routes/templates').router
var pages = require('./routes/pages')

var app = express()

app.locals.config = config

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(processImage({root: path.join(__dirname, 'public')}))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/settings', settings)
app.use('/api/users', users)
app.use('/api/dashboard', dashboard)
app.use('/api/files', files)
app.use('/api/templates', templates)
app.use('/api/pages', pages)

// passport config
var User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// mongoose
mongoose.connect(config.db.url)

app.get('*', function(req, res) {
  res.render('index')
})

MongoClient.connect(config.db.url, function(err, db) {
  if (err) throw err
  app.locals.db = db
  app.listen(config.app.port, function(err) {
    if (err) {
      throw err
    }
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
