const mongoose = require('mongoose');
module.exports = () => {
  function connect() {
    mongoose.connect('localhost:27017', function(err) { //mongodb connect
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);  //reconnect
  require('./user');
};
