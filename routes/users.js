var express = require('express');
var router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    niceUser = new User(req.user);
    res.render('user-profile', { user: niceUser });
  } else {
    res.render('user-noprofile');
  }
});

// Get login request
// .get method -- route, middleware, callback (optional)
router.get('/login',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Get return request
router.get('/return',
  // middleware
  passport.authenticate('google', { failureRedirect: './' }),
  // callback -- what happens after we have authenticated user
  async function(req, res) {

    // See if user is in database
    var userExists = await User.checkUserExists(req.user.id);

    if (userExists == false) {
      var newUser = await User.addUser(req.user);
    }

    res.redirect('./');

  }
);

/* GET logout request. */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('./');
});

// Passport Helper Methods
/**
 * This function is called when the `passport.authenticate()` method is called.
 * 
 * If a user is found an validated, a callback is called (`callback(null, user)`) with the user
 * object.  The user object is then serialized with `passport.serializeUser()` and added to the 
 * `req.session.passport` object. 
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://8081-dot-10520905-dot-devshell.appspot.com/users/return'
  },
  function(accessToken, refreshToken, profile, callback) {
    // This will return the user's Google profile

    // The callback function has two parameters: an error, and a user object.  If there's no error, pass null as the first argument.
    return callback(null, profile);
  })
);

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation
 */
passport.serializeUser(function(user, callback) {
    callback(null, user);
});

/**
 * This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
 * Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
 * 
 * In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
 * object later on.
 */
passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
});

module.exports = router;
