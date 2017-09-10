var mongoose = require('mongoose');

var lectureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true},
  name: String,
  password: { type: String, required: true},
  admin: Boolean,
});


module.exports = mongoose.model('Lecture', lectureSchema);
