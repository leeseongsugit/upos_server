var grid = require('gridfs-stream');
var mongoose = require('mongoose');
var ObjectID = require('mongoose').mongo.objectID;
var multer = require('multer');
var fs = require('fs');
var mongo = mongoose.mongo;


//DB연결 - 분산처리
var connection = mongoose.createConnection(mongodb://localhost/DBdata);
var connection.db;
var gfs = grid(db, mongo);


/*웹서버 채팅*/
app.use(multer({
  dest: '../upload/',
  limits: {
    fileSize: 1024*1000*100 //filesize < 100MB
  }
}));


//업로드 - 분산처리
app.post('/upload', function(req, res){
  var title = req.body.title;  //inputText의 name Value를 가져옴
  var fileObj = req.files.myFile;
  var orgFileName = fileObj.originalname;  //원본파일명 저장
  var savePath = __dirname + '/../upload/' + saveFileName;  //저장된 파일명
  //get gfs output stream
  var writeStream = gfs.createWriteStream({
    'filename': orgFileName,
    'metadata': {
      'title': title
    }
  });
  //경로에 업데이트 된 파일을 읽어들여서 girdfs 출력 스트림에 연결
  fs.createReadStream(savePath).pipr(writeStream);
  //스트림 연결 종료 -> close 이벤트 발생
  writeStream.on('close', function(file){
    //몽고DB는 데이터 저장시 무조건 파일시스템을 거쳐가기 때문에 파일시스템의 데이터는 삭제
    fs.unlink(savePath, function() {});
    res.send('ok');
  });
});


//Download 요청 처리
app.get('/download', function(req, res){
  var _id = req.query.id;
  gfs.files.find({'_id': objectId})
    .toArray(function(err, files) {
      if(err).res.send(err);
      var filename = files[0].filename;
      //gfs에서 읽어올 스트림 객체 가져오기
      var readStream = gfs.createReadStream({'_id': _id});
      //Download
      res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(filename));
      res.setHeader("Content-Type","application/octet-stream");
      //readStream에 있는 Data를 res객체에 옮긴다
      readStream.pipe(res);
  })
});

//삭제 요청 처리
app.get("/delete", function(req, res){
  var _id = req.query.id;
  gfs.remove({'_id': ObjectID)(_id)}, function(err) {
    if(err) res.send(err);
    res.end("ok");
  });
});
