const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

function MongoUtils() {
  const mu = {};
  let uri ="";
  mu.setUri = (puri) => {
    uri = puri;
  } ;
  mu.connect = () => {
    const client = new MongoClient(
      uri,
      { useNewUrlParser: true },
      { useUnifiedTopology: true }
    );
    console.log("Connecting");
    //retorna una promesa
    return client.connect();
  };

  mu.getDBS = client => {
    //returns a promise with the list of databases
    return client
      .db()
      .admin()
      .listDatabases()
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  mu.getCollections = (client, dbName) => {
    return client
      .db(dbName)
      .listCollections()
      .toArray()
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  mu.getDocumentsFromCol = (client, dbName, collectionName) => {
    const collectionDB = client.db(dbName).collection(collectionName);
    console.log("Getting documents");
    //retorna una promesa
    return collectionDB
      .find({})
      .limit(20)
      .sort({_id: -1})
      .toArray()
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  mu.insertToCollection = (client, dbName, collectionName, data) => {
    const collectionDB = client.db(dbName).collection(collectionName);
    return collectionDB
      .insertOne(data)
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  mu.deleteFromCollection = (client, dbName, collectionName, id) => {
    const collectionDB = client.db(dbName).collection(collectionName);
    return collectionDB
      .deleteOne({_id:ObjectId(id)})
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  mu.updateDocument = (client, dbName, collectionName, id, update) =>{
    const collectionDB = client.db(dbName).collection(collectionName);
    return collectionDB
      .updateOne({_id:ObjectId(id)}, update)
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  return mu;
}

module.exports = MongoUtils();
