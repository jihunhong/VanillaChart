const MongoClient = require('mongodb').MongoClient;



const client = new MongoClient(uri, { useNewUrlParser: true, 
                                      useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  
  collection.insert({a: 1}, (err, result)=> 
    console.log('inserted'));
  client.close();
});