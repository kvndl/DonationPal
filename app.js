require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Session & Cookies
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongo = require('./services/db');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campaignsRouter = require('./routes/campaigns');
const searchRouter = require('./routes/search');

// General Setup
const app = express();

// Database Config
async function startDB() {
  await mongo.init();
}
startDB();

// Session Setup
app.use(session({
  store: new MongoStore({
    url: process.env.MONGO_CONNECTION_STRING
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 *60 *60 *24 *7 *2 } // two weeks to live
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Router Middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campaigns', campaignsRouter);
app.use('/search', searchRouter);

// Error Handling
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
