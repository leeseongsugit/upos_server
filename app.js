// 모듈 추출
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var db = require('./db');
var route = require('./routes/route');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');  //파일 로드 사용
var session = require('express-session');
var passport = require('./passport');
var user = require('./user');
//var vidStremer = require('vid-streamer');  // 동영상 스트리밍

var route = require('./routes/route');
var users = require('./routes/users');

//웹서버 생성
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//세션 활성화
app.use(session({
  secret : 'mysecret',
  resave: true,
  saveUninitialized: false
}));

//패스포트 초기화, 세션 사용
app.use(passport.initialize());
app.use(passport.session());


//db, passport 실행
db();
passport();


app.use('/', route);
app.use('/users', route);

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
