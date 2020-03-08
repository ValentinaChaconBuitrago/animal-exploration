var express = require("express");
var router = express.Router();

const mu = require("../db/MongoUtils.js");

/* GET home page. */
router.get("/", function(req, res) {
  console.log("llego a la main page");
  res.render("input",{});
  //en dbs entra la lista de bases de datos que tiene mi cliente
});

/* GET collections of a certain database */
router.get("/savedb" , (req,res) => {
  const param = req.query.linkConnection;
  mu.setUri(param);
  mu.connect()
    .then(mu.getDBS)
    .then(dataBases => res.render("index", { dbs: dataBases.databases}))
    .catch(err => console.log(err));
});

/* GET collections of a certain database */
router.get("/database/:name/" , (req,res) => {
  console.log("llege a las collections");
  const dbName = req.params.name;
  const param = req.query.linkConnection;
  mu.connect(param)
    .then(client => mu.getCollections(client,dbName))
    .then(collection =>{
      console.log("collection", collection);
      res.json(collection);
    })
    .catch(err => console.log(err));
});

/* GET documents in a collection */
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

/* POST documents in a colection */
router.get("/database/:name/:collection" , (req,res) => {
  console.log("params",req.query);
  const dbName = req.params.name;
  const collectionName = req.params.collection;
  mu.connect()
    .then(client => mu.insertToCollection(client,dbName,collectionName,req.body))
    .then(res.redirect("/"))
    .catch(err => console.log(err));
});


/* DELETE documents in a collection */
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

/* UPDATE documents in a collection */
router.put("/database/:name/:collection/:id" , (req,res) => {
  console.log("voy a actualizar el documento");
  const dbName = req.params.name;
  const collectionName = req.params.collection;
  const id = req.params.id;
  mu.connect()
    .then(client => mu.updateCollection(client,dbName,collectionName,id,{ $set: req.body}))
    .then(res.redirect("/"))
    .catch(err => console.log(err));
});



module.exports = router;
