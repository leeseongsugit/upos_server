var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  id: String,
  password: String,
});

userSchema.methods.comparePassword = (inputPassword, cb) => {
  if (inputPassword === this.password) {
    cb(null, true);
  } else {
    cb('error');
  }
};

module.exports = mongoose.model('user', userSchema);
