var fs = require('fs');
var csv = require('fast-csv');
var stream = fs.createReadStream('../user/users.csv');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var masterList = [];
mongoose.connect('mongodb://localhost/upos_user');
var User = require("../public/models/user_db");

//read in CSV as stream row by row
csv.fromStream(stream, {headers:true})
    .on('data', function(data){
      // console.log(data);
      // masterList.push(data);
      addUserToCollection(data);
    })
    .on('end', function(){
      // console.log('done');
      console.log(masterList.toString());
    });

function addUserToCollection(data){
  //scrub data for validation
  data.id = data.id.replace(/,/g, '');
  data.name = data.name.replace(/,/g, '');
  data.password = data.password.replace(/,/g, '');
  data.email = data.email.replace(/,/g, '');
  data.phone = data.phone.replace(/,/g, '');
  data.admin = data.admin.replace(/,/g, '');

  //create model and save to database
  var user = new User(data);
  user.save(function (err) {
    if (err) // ...
    console.log(err);
  });
}

module.exports = csv_import;
