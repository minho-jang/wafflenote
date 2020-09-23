var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  fs = require('fs');

//Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

var url = "MONGODB_URL";
var options = { 
  sslValidate: true,
  sslCA:ca,
  useNewUrlParser: true
}

//Create a MongoDB client, open a connection to Amazon DocumentDB as a replica set, 
//  and specify the read preference as secondary preferred
MongoClient.connect(url, options, function(err, client) {
  if(err)
      throw err;
      
  //Specify the database to be used
  db = client.db('sample-database');
  
  //Specify the collection to be used
  col = db.collection('sample-collection');

  //Insert a single document
  col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
    //Find the document that was previously written
    col.findOne({'hello':'Amazon DocumentDB'}, function(err, result){
      //Print the result to the screen
      console.log(result);
      
      //Close the connection
      client.close()
    });
  });
});
