var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../public/models/user_db');

router.get('/register', function(req, res){
  res.render('register');
});

router.get(['/','/login'], function(req, res){
  res.render('login');
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  User.register(new User({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/login');
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/filepresent');
});


router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
