var mongoose = require('mongoose');
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

module.exports = db;
/*

var mongoose = require('mongoose');
var db = mongoose.connection;
var user = require('./user');

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
  console.log("connect successfully");
});

mongoose.connect("mongodb://localhost/DBData");

module.exports = db;
*/
