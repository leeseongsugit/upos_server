// 모듈 추출
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var route = require('./routes/route');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');  //파일 로드 사용
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var flash = require('connect-flash');
var User = require('./public/models/user_db');
var csv = require('fast-csv');

//db
mongoose.connect('mongodb://localhost/upos_db')
var db = mongoose.connection;
db.on('err', console.error.bind(console,'connection error:'));
db.once('open', function(){
  console.log('db connected');
});

//routing
var route = require('./routes/route');
var users = require('./routes/users');
var filemanage = require('./routes/filemanage');
var mypage = require('./routes/mypage');

//웹서버 생성
var app = express();
app.listen(3000, function(){
  console.log('server start');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//세션 활성화
app.use(session({
  secret : 'mysecret',
  resave: false,
  saveUninitialized: true
}));
console.log('session activate');

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
console.log('passport ok');

//passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routing
app.use('/', route);
app.use('/filepresent', filemanage);
app.use('/mypage', mypage);
app.use('/users', users);

//gridfs
//app.use('/uploads', express.static(__dirname + '/uploads'));
//app.post(multer({
//  dest: './upload/',
//  limits: {
//    fileSize: 1024*1000*100 //filesize < 100MB
//  }
//}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
