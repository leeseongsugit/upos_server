
var express = require('express');
var passport = require('passport');
var grid = require('gridfs-stream');
var mongoose = require('mongoose');
var ObjectID = require('mongoose').mongo.objectID;
var multer = require('multer');
var fs = require('fs');
var mongo = mongoose.mongo;
var router = express.Router();
var Content = require('../public/models/content_db');
var dateFormat = require('dateformat');
var vidStreamer = require('vid-streamer');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'public/upload/');
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
router.get('/searchList', function(req,res){
  var classno = req.query.classno;
  var type = req.query.type;
  if(classno == '' && type == ''){
    Content.find(function(err, data){
      if(err)
        return res.status(500).send({error: 'database failure'});
      res.render('./filemanage/filepresent', {contents : data});
      //res.json(data);
    });
  }else if(classno == ''){
    Content.find({type : type}, function(err, data){
      if(err){
        return res.status(500).send({error: 'database failure'});
        console.log(err);
      }
      res.render('./filemanage/filepresent', {contents : data});
    });
  }else if(type == ''){
    Content.find({classno : classno}, function(err, data){
        if(err){
          return res.status(500).send({error: 'database failure'});
          console.log(err);
        }
        res.render('./filemanage/filepresent', {contents : data});
      });
  }else{
    Content.find({classno : classno, type : type}, function(err, data){
      if(err){
        return res.status(500).send({error: 'database failure'});
        console.log(err);
      }
      res.render('./filemanage/filepresent', {contents : data});
    });
  }
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
    content.classno = req.body.classno;
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

router.get('/download/:content_id', function(req, res){
  Content.findOne({_id : req.params.content_id}, function(err, data){
    var path = data.upFile[0].path;
    var fileName = data.upFile[0].filename;
    if(err)
      return res.status(500).send({error: 'database failure'});
    res.download(path, fileName);
    console.log(path + " / " + fileName);
  });
});


router.get('/show/:content_id', function(req,res){
  Content.find(function(err, data){
    if(err)
      return res.status(500).send({error: 'database failure'});
    res.render('./filemanage/showcontents', {contents : data});
    //res.json(data);
  });
});

router.get('/present/:content_id', function(req, res){
  Content.findOne({_id : req.params.content_id}, function(err, data){
    var path = data.upFile[0].path;
    var fileName = data.upFile[0].filename;
    if(err)
      return res.status(500).send({error: 'database failure'});

    if(data.upFile[0].mimetype == 'application/pdf'){
      res.redirect('/config/pdf/web/viewer.html?file=/upload/'+fileName);
    }else if(data.upFile[0].mimetype == 'video/mp4'){
      res.redirect('/upload/'+fileName);
    }
  });
})

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
