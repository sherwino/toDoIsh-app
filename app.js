// also known as Server.js
const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');
const cors         = require('cors');

require('dotenv').config();

require('./config/passport-config');

// Had to do this I was getting a mongoose Err
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI);
console.log('Successfully connected to MongoDB!');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - To Do app';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

//we add this line of code after installing express-session
app.use(session({
  secret: 'something with TodoS',
  resave: true,
  saveUninitialized: true
}));

app.use(flash()); //this middleware has to come after session()

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  credentials: true,
  origin: [ 'http://localhost:4200' ]
}));

// This middleware sets the user variable for all views
// (only if logged in)
//   user: req.user     for all renders!
app.use((req, res, next) => {
  if (req.user) {
    // Creates a variable "user" for views
    res.locals.user = req.user;
  }

  next();
});


// ROUTES GO HERE --------------------------------------------------------------

const index = require('./routes/index');
app.use('/', index);

const myAuthStuff = require('./routes/auth-api-routes');
app.use('/', myAuthStuff);

const myListStuff = require('./routes/list-api-routes');
app.use('/', myListStuff);

const myCardStuff = require('./routes/card-api-routes');
app.use('/', myCardStuff);


// -----------------------------------------------------------------------------


// Display the Angular app if no route matches
app.use((req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;