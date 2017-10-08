var mongoose = require('mongoose');

var contentSchema = mongoose.Schema({
    writer: String,
    title: String,
    contents: String,
    classno: String,
    weeks: Number,
    type: String,
    comments: [{
        name: String,
        memo: String,
        date: String
    }],
    count: {type:Number, default: 0},
    date: String,
    updated: [{title: String, contents: String, date: String}],
    deleted: {type: Boolean, default: false}, // true면 삭제 된 경우임
    upFile:[] // 업로드 된 파일 저장된 주소
});

module.exports =  mongoose.model('Contents', contentSchema);
