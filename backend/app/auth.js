// Require modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

/**
 * @param {import('awilix').AwilixContainer} container
 */
const configure = container => {
  const accounts = container.resolve('accounts');

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
          else {
            accounts.findByUsername(username).then(user => done(null, user))
          }
        })
        .catch(err => done(err, null));
    }
  ));

  // Serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    accounts.findById(id)
      .then(user => {
        if (!user) done('Unknown user!', null);
        else done(null, user);
      })
      .catch(err => done(err, null));
  });
};

// export init function
module.exports = app => {

  /** @type {import('awilix').AwilixContainer} */
  const container = app.get('container');

  /** @type {import('@wogjs/types').RedisManager} */
  const redis = container.resolve('redis');

  const config = container.resolve('config');
  const theUrl = new URL(config.app.url);

  // setup session store
  app.use(session({
    secret: config.secure.secret,
    saveUninitialized: true,
    resave: false,
    unset: 'destroy',
    store: new RedisStore({ client: redis.client }),
    cookie: Object.assign({
      secure: theUrl.protocol === 'https'
    }, config.secure.cookie)
  }));

  configure(container);

  // Init passport authentication
  app.use(passport.initialize());

  // persistent login sessions
  app.use(passport.session());

  // persist passport instance
  app.set('passport', passport);
};
