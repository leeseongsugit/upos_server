var mongoose = require('mongoose');

var User = mongoose.model('User', userSchema);

var userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true},
  name: String,
  password: { type: String, required: true},
  admin: Boolean,
});

userSchema.methods.comparePassword = (inputPassword, cb) => {
  if (inputPassword === this.password) {
    cb(null, true);
  } else {
    cb('error');
  }
};

module.exports = mongoose.model('User', userSchema);
