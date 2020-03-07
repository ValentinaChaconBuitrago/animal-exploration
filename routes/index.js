var express = require("express");
var router = express.Router();

const mu = require("../db/MongoUtils.js");

/* GET home page. */
router.get("/", function(req, res) {
  mu.connect()
    .then(mu.getDBS)
    .then(dataBases => res.render("index", { dbs: dataBases.databases}))
    .catch(err => console.log(err));
  //en dbs entra la lista de bases de datos que tiene mi cliente
});



/* GET collections of a certain database */
router.get("/database/:name/" , (req,res) => {
  console.log("llege a las collections");
  const dbName = req.params.name;
  mu.connect()
    .then(client => mu.getCollections(client,dbName))
    .then(collection =>{
      console.log("collection", collection);
      res.json(collection);
    })
    .catch(err => console.log(err));
});

/* GET documents in a colection */
router.get("/database/:name/:collection/" , (req,res) => {
  console.log("llege a los documentos");
  const dbName = req.params.name;
  const collectionName = req.params.collection;
  mu.connect()
    .then(client => mu.getDocumentsFromCol (client,dbName,collectionName))
    .then(documents =>{
      console.log("documents", documents);
      res.json(documents);
    })
    .catch(err => console.log(err));
});


/* Delete documents in a colection */
router.delete("/database/:name/:collection/:id" , (req,res) => {
  console.log("voy a borrar el documento");
  const dbName = req.params.name;
  const collectionName = req.params.collection;
  const id = req.params.id;
  mu.connect()
    .then(client => mu.deleteFromCollection(client,dbName,collectionName,id))
    .then(res.redirect("/"))
    .catch(err => console.log(err));
});


module.exports = router;
