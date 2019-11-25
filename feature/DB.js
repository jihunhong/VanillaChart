const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://chart:<password>@cluster0-v0qur.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, 
                                      useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  
  collection.insert({a: 1}, (err, result)=> 
    console.log('inserted'));
  client.close();
});