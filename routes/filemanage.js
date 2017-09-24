
var express = require('express');
var grid = require('gridfs-stream');
var mongoose = require('mongoose');
var ObjectID = require('mongoose').mongo.objectID;
var multer = require('multer');
var fs = require('fs');
var mongo = mongoose.mongo;
var router = express.Router();
var Content = require('../public/models/content_db');
var dateFormat = require('dateformat');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'upload/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});
var upload = multer({storage: storage});

router.get('/', function(req,res){
    Content.find(function(err, data){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.render('./filemanage/filepresent', {contents : data});
      //res.json(data);
    });
});
//GET CONTENTS BY content_id not activate
router.get('/api/:content_id', function(req,res){
  Content.find({_id: req.params.content_id}, function(err, data){
    if(err)
      return res.status(500).send({error: err});
    if(!data)
      return res.status(404).send({error: 'book not found'});
    res.render('./filemanage/filepresent', {contents : data});
  });
});

// GET CONTENTS BY WRITER not activate
router.get('/api/:writer', function(req, res){
    Content.find({writer: req.params.writer},  function(err, data){
        if(err)
          return res.status(500).send({error: err});
        if(contents.length === 0)
          return res.status(404).send({error: 'book not found'});
        res.render('./filemanage/filepresent', {contents : data});
    });
});

router.get('/upload', function(req, res){
  res.render('./filemanage/fileup');
});

router.post('/upload', upload.single('userfile'), function(req, res){
  console.log('upload post enter');
  try{
    var file = req.file;
    var content = new Content();
    var now = new Date();

    content.title = req.body.title;
    content.writer = req.session.username;
    content.contents = req.body.contents;
    content.class = req.body.class;
    content.weeks = req.body.weeks;
    content.type = req.body.type;
    content.date = dateFormat(now, "yy/mm/dd HH:MM:ss");
    content.upFile = req.file;
    console.log('upload variable input');
    console.log('upload db input');

    content.save(function(){
      res.redirect('/filepresent');
      console.log('success');
    })
  }catch(err){
    console.dir(err.stack);
  }
});



router.get('/show/:content_id', function(req,res){
  Content.find(function(err, data){
    if(err)
      return res.status(500).send({error: 'database failure'});
    res.render('./filemanage/showcontents', {contents : data});
    //res.json(data);
  });
});
//진행중
router.get('/present/:content', function(req, res){
  //pdf.js와 연동
})
router.get('/download/:content_id', function(req, res){
  Content.findOne({_id : req.params.content_id}, function(err, data){
    var path = data.upFile[0].path;
    var fileName = data.upFile[0].filename;
    if(err)
      return res.status(500).send({error: 'database failure'});
    res.download(path, fileName);
  });
});

function day_time(){
  var now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
}
module.exports = router;
