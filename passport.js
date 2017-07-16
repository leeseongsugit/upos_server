var passport = require('passport');
var LocalStrategy = require('passport-session').Strategy;
var Users = require('./user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    User.findById(id, (err, user) => {
      done(null, user);
    });
  });

  passport.use(new LocalStrategy({
    idField: 'id',
    passwordField: 'password',
    session: true,
    passReqToCallback: false,
  }, (id, password, done) => {
    users.findOne({id: id}, (findError, user) => {
      if(findError) return done(findError);
      if(!user) return done(null, false, { message: 'not present id'});
      return user.comparePassword(password, (passError, isMatch) => {
        if(isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'not equal password'});
      });
    });
  }));
};

module.exports = passport;
