
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

router.get('/api/:content_id', function(req,res){
  Content.find({_id: req.params.content_id}, function(err, data){
    if(err)
      return res.status(500).send({error: err});
    if(!book)
      return res.status(404).send({error: 'book not found'});
    res.render('./filemanage/filepresent', {contents : data});
  });
});

// GET CONTENTS BY WRITER
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
//진행중
router.get('/download/:content_id', function(req, res){
  Content.findOne({_id : req.params.content_id}, function(err, data){
    var path = data.upFile[0].path;
    var fileName = data.upFile[0].filename;
    if(err)
      return res.status(500).send({error: 'database failure'});
    res.download(path, fileName);
  });
});
/*//업로드 - 분산처리
router.post('/upload', function(req, res){
  var title = req.body.title;  //inputText의 name Value를 가져옴
  var writer = req.body.writer;
  var contents = req.body.contents;
  var weeks = req.body.weeks;
  var type = req.body.type;
  var fileObj = req.files.userfile;
  var orgFileName = fileObj.originalname;  //원본파일명 저장
  var savePath = __dirname + '/../public/upload/' + saveFileName;  //저장된 파일명
  //get gfs output stream
  var writeStream = gfs.createWriteStream({
    'filename': orgFileName,
    'metadata': {
      'title': title
      'writer': writer
      'contents': contents
      'weeks': weeks
      'type': type
    }
  });
  //경로에 업데이트 된 파일을 읽어들여서 girdfs 출력 스트림에 연결
  fs.createReadStream(savePath).pipe(writeStream);
  //스트림 연결 종료 -> close 이벤트 발생
  writeStream.on('close', function(file){
    //몽고DB는 데이터 저장시 무조건 파일시스템을 거쳐가기 때문에 파일시스템의 데이터는 삭제
    fs.unlink(savePath, function() {});
    res.send('ok');
  });
});


//Download 요청 처리
router.get('/download/:id', function(req, res){
  var _id = req.query.id;
  gfs.files.find({'_id': objecDate.nowtId})
    .toArray(function(err, files) {
      if(err) res.send(err);
      var filename = files[0].filename;
      //gfs에서 읽어올 스트림 객체 가져오기
      var readStream = gfs.createReadStream({'_id': _id});
      //Download
      res.semyFiletHeader("Content-Disposition", "attachment;filename=" + encodeURI(filename));
      res.setHeader("Content-Type","application/octet-stream");
      //readStream에 있는 Data를 res객체에 옮긴다
      readStream.pipe(res);
  })
});

//삭제 요청 처리
router.get('/delete/:id', function(req, res){
  var _id = req.query.id;
  gfs.remove({'_id': ObjectID(_id)}, function(err) {
    if(err) res.send(err);
    res.end("ok");
  });
});
*/
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
