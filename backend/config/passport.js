
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');  
const bcrypt = require('bcryptjs');

// LocalStrategy configuration for passport
passport.use(new LocalStrategy({
  usernameField: 'email',  
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    return done(null, user);  // User is authenticated
  } catch (err) {
    return done(err);
  }
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
