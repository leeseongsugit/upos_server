var express = require('express');
var router = express.Router();

router.get(['/','/mypage'], function(req, res){
  res.render('./mypage/updateinfo', { username : req.session.username});
});

router.post('/mypage', (req, res) => {
  if(req.body.phone) user.phone = req.body.phone;
  if(req.body.email) user.email = req.body.email;
  user.save(function(err){
    if(err) res.status(500).send({err: "failed to update"});
    res.send("information updated");
  });
});

router.get('/updatepassword', function(req, res){
  res.render('./mypage/updatepassword');
});

module.exports = router;
