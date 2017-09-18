
var express = require('express');
var grid = require('gridfs-stream');
var mongoose = require('mongoose');
var ObjectID = require('mongoose').mongo.objectID;
var multer = require('multer');
var fs = require('fs');
var mongo = mongoose.mongo;
var router = express.Router();
var Contents = require('../public/models/content_db');

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
  res.render('./filemanage/filepresent');
});

router.get('/upload', function(req, res){
  res.render('./filemanage/fileup');
});

router.post('/upload', upload.single('userfile'), function(req, res){
  console.log('upload post enter');
  try{
    var file = req.file;
    var content = new Contents();

    var originalname = '';
    var filename = '';
    var mimetype = '';
    var size = 0;

    console.log('upload variable initialize');

    originalname = file.originalname;
    filename = file.filename;
    mimetype = file.mimetype;
    size = file.size;

    console.log('upload variable input');

    content.title = req.body.title;
    content.writer = req.body.writer;
    content.contents = req.body.contents;
    content.weeks = req.body.weeks;
    content.type = req.body.type;
    content.date = Date.now();

    console.log('upload db input');

    console.log('present file info : ' + originalname + ' / ' + filename + ' / ' + mimetype + ' / ' + size );

    content.save(function(){
      res.redirect('/filepresent');
      console.log('success');
    })
  }catch(err){
    console.dir(err.stack);
  }
});



router.get('/show/:content', function(req,res){
  res.send(content.contents);
})
router.get('/present/:content', function(req, res){
  //pdf.js와 연동
})

router.get('/download/:content', function(req, res){
  res.download('/upload/'+ req.params.content)
})
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
  gfs.files.find({'_id': objectId})
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
module.exports = router;
