
class Query{
  constructor(){}

  async findCollection(db, chartName){

      const collection = db.collection(chartName);

      return await collection.find().sort({rank : 1}).toArray();
  }
  
  insertOldDocuments(db, callback, chart, chartName){
      const collection = db.collection('old_'+chartName);
          
      collection.insert( 
          chart , (err, result) =>{
        assert.equal(err, null);

        callback();
      });
  }

  insertDocuments(db, callback, chart, chartName){
      const collection = db.collection(chartName);
      collection.remove({});

      collection.insert( 
          chart , (err, result) =>{

        callback();
      });
  }


}

module.exports = Query