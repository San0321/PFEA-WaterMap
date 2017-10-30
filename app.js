// dependencies
// var favicon = require('serve-favicon');
var express = require('express'),
    path    = require('path'),
    logger        = require('morgan'), // middleware logger
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose');

// routing stuff
var index = require('./routes/index'),
    users = require('./routes/users'),
    upload = require('./routes/upload'),
    signup = require('./routes/signup'),
    login = require('./routes/login');

// models
// var User = require('./models/user');
var Report = require('./models/report');

var app = express();

const PORT = process.env.PORT || '3000';

// connect to db
var uri = "mongodb://test:test@ds151451.mlab.com:51451/reports";
mongoose.connect(uri);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "its a secret", resave: true, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));


// set locals so that they can be easily accessed in views
app.use(function(req, res, next) {
  if (req.session.username) {
    res.locals.user = true;
    res.locals.username = req.session.username;
  } else {
    res.locals.user = false;
  }
  next();
})

app.use('/', index);
app.use('/users', users);
app.use('/upload', upload);
app.use('/signup', signup);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, function() {
    console.log('listening on port 3000')
});
