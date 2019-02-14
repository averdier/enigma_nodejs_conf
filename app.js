var mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io = require('socket.io');
var io = socket_io();

mongoose.connect('mongodb://localhost:27017/examens', {
  useNewUrlParser: true
})

const User = require('./models/user')
User.find({
  name: 'rastaadmin'
}, (err, results) => {
  if (!err && results.length === 0) {
    let user = new User({
      username: 'rastaadmin',
      password: 'rastaadmin',
      admin: true
    })
    user.save((err) => {
      if (!err) {
        console.log('admin created')
      }
    })
  }
})

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin');
var apiAuthRouter = require('./routes/api/auth');
var apiConferenceRouter = require('./routes/api/conference')


var app = express();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter)
app.use('/api/auth', apiAuthRouter);
app.use('/api/conferences', apiConferenceRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
