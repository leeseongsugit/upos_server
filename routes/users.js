var express = require('express');
var router = express.Router();

var User = require("../public/models/user_db");


//Create
/* GET users listing. */
router.get('/users', function(req, res) {
  User.find({ }, function(err, users) {
    if(err)           return res.status(500).send(err);
    if(!users.length) return res.status(404).send({ err: "User not found"});
    res.send("User find successfully:\n" + users);
  });
});

//Find by ID
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if(err)     return res.status(500).send(err);
    if(!user) return res.status(404).send({ err: "User not found"});
    res.send("User findById successfully:\n" + user);
  })
})

//Find and Update
router.put("/users/id/:id", function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, user) {
    if(err) return res.status(500).send(err);
    res.send("User findByIdAndUpdate successfully:\n" + user);
  });
});

//Remove all
router.delete("/users/", function(req, res){
  User.remove({ }, function(err) {
    if(err) return res.status(500).send(err);
    res.send("User all deleted successfully");
  });
});

//Find and remove
router.delete("/users/:id", function(req, res, next){
  User.remove({ id: req.params.id }, function(err) {
    if(err) return res.status(500).send(err);
    res.send("User deleted successfully");
  });
});

module.exports = router;
