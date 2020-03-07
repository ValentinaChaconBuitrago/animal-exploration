const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

function MongoUtils() {
  const mu = {};

  mu.connect = () => {
    const uri =
      "mongodb+srv://val:val@cluster0-wnneh.azure.mongodb.net/test?retryWrites=true&w=majority";

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

  mu.updateCollection = (client, dbName, collectionName, data, update) =>{
    const collectionDB = client.db(dbName).collection(collectionName);
    return collectionDB
      .updateOne(data, update)
      .finally(() => {
        console.log("closing client");
        client.close();
      });
  };

  return mu;
}

module.exports = MongoUtils();
