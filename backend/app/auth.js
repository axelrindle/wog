// Require modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// Configure strategy
passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },
  (req, username, password, done) => {
    accounts.checkAuth(username, password)
      .then(success => {
        if (!success) {
          req.flash('username', username);
          done(null, false);
        }
        else return done(null, username);
      })
      .catch(err => done(err, null));
  }
));

// Serialization
passport.serializeUser((username, done) => {
  done(null, username);
});
passport.deserializeUser((username, done) => {
  accounts.find(username)
    .then(user => {
      if (!user) done('Unknown user!', null);
      else done(null, user);
    })
    .catch(err => done(err, null));
});

// export init function
module.exports = app => {

  // setup session store
  app.use(session({
    secret: config.secure.secret,
    saveUninitialized: true,
    resave: false,
    store: new RedisStore(config.secure.redis)
  }));

  // Init passport authentication
  app.use(passport.initialize());

  // persistent login sessions
  app.use(passport.session());

  // persist passport instance
  app.set('passport', passport);
};
