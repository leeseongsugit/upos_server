var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require('../user');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/');
});

router.get('/home', (req, res) => {
  User.find({ name: req.params.name }, (err, user) => {
    res.render('home', { user: user } );
  });
});


module.exports = router;
