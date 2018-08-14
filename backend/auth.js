// Require modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const accounts = require('../accounts');
const config = require('../config');

// Configure strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    if (accounts[username] === undefined) {
      return done(null, false, { message: 'Unknown username!' });
    }
    if (accounts[username] !== password) {
      return done(null, false, { message: 'Incorrect password!' });
    }

    return done(null, username);
  }
));

// Serialization
passport.serializeUser((username, done) => {
  done(null, Object.keys(accounts).indexOf(username));
});
passport.deserializeUser((index, done) => {
  const user = Object.keys(accounts)[index];
  const exists = user !== undefined;
  if (!exists)
    done('Unknown username!', null);
  else
    done(null, user);
});


// export configured passport instance
module.exports = app => {

  // setup session store
  app.use(session({
    secret: config.session.secret,
    saveUninitialized: true,
    resave: false,
    store: new RedisStore(config.session.redis)
  }));

  // Init passport authentication
  app.use(passport.initialize());
  // persistent login sessions
  app.use(passport.session());

  return passport;
};
