var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require('../user');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/:name', (req, res) => {
  User.find({ name: req.params.name }, (err, user) => {
    res.render('main', { user: user } );
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
