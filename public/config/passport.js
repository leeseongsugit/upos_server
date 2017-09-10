/*var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user_db');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  passport.use('register', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
    function(req, username, password, done) {
      User.findOne({ 'username' : username }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, false, req.flash('registerMessage', '이메일이 존재합니다.'));
        } else {
          var newUser = new User();
          newUser.username = req.body.username;
          newUser.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    }));

  passport.use('login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
    function(req, username, password, done) {
      User.findOne({ 'username' : username }, function(err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', '사용자를 찾을 수 없습니다.'));
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', '비밀번호가 다릅니다.'));
        return done(null, user);
      });
    }));
};
*/
