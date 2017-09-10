var mongoose = require('mongoose');

var contentSchema = mongoose.Schema({
    writer: String,
    password: String,
    title: String,
    contents: String,
    comments: [{
        name: String,
        memo: String,
        date: {type: Date, default: Date.now}
    }],
    count: {type:Number, default: 0},
    date: {type: Date, default: Date.now},
    updated: [{title: String, contents: String, date:{type: Date, default: Date.now}}],
    deleted: {type: Boolean, default: false}, // true면 삭제 된 경우임
    fileUp:[String] // 업로드 된 파일 저장된 주소
});

module.exports =  mongoose.model('Contents', contentSchema);
