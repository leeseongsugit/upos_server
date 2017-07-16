var multer = require('multer');
var fs = require('fs');
var mongoose = require('mongoose');
var user = require('./user');

app.use(multer({dest'../upload/'}));

//DB연결
mongoose.connect('mongodb://localhost/DBData');
var db = mongoose.connection;
db.once('open', function(err){
  if(err) console.log(err);
});

//업로드 요청처리
app.post('/upload', function(req, res){
  var title = req.body.title;  //inputText의 name Value를 가져옴
  var fileObj = req.files.myFile;
  var orgFileName = fileObj.originalname;  //원본파일명 저장
  var saveFileName = fileObj.name;  //저장된 파일명
  //추출한 데이터를 Object에 담음
  var obj = {"title":title, "orgFileName":orgFileName, "saveFileName": saveFileName};
  //DBData 객체에 입력
  var newData = newDBData(obj);
  newData.save(function(err){  //DB에 저장
    if(err) res.send(err);
    res.end('ok');
  });
});

//Download 요청 처리
app.get('/download', function(req, res){
  var _id = req.query.id;
  DBData.findOne({"_id":_id})
  .select("orgFileName saveFileName")
  .exec(function(err, data){
    var filePath = __dirname + "/../upload/" + data.saveFileName;
    var fileName = data.orgFileName;
    //응답 헤더에 파일 이름과 Type을 명시
    res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(filename));
    res.setHeader("Content-Type","binary/octet-stream");
    //filePath에 엤는 파일 스트림 객체를 얻음
    var fileStream = fs.createReadStrem(filePath);
    //Download(res 객체에 전송)
    fileStream.pipe(res);
  });
});

//삭제 요청 처리
app.get("/delete", function(req, res){
  var _id = req.query.id;
  DBData.findOne({"_id":_id})
  .select("saveFileName")
  .exec(function(err, data){
    var filePath = __dirname + "/../upload/" + data.saveFileName;
    fs.unlink(filePath, function(){
      DBData.remove({"_id":_id}, function(err){
        if(err) res.send(err);
      res.end("ok");
    });
  });
});
