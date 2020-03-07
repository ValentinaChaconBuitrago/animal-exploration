const targetCollection = document.querySelector("#chose-collection");

const renderDocuments = documents => {
  console.log("got documents", documents);
  const table = document.getElementById("collection-table");
  table.innerHTML = "";
  //table head
  let tHead = document.createElement("thead");
  tHead.className = "thead-dark";

  let tr = document.createElement("tr");
  for (const key in documents[0]) {
    console.log("key", key);
    let th = document.createElement("th");
    th.scope = "col";
    th.textContent = key;
    tr.append(th);
  }
  let th = document.createElement("th");
  th.scope = "col";
  th.textContent = "update";
  tr.append(th);

  th = document.createElement("th");
  th.scope = "col";
  th.textContent = "delete";
  tr.append(th);

  tHead.append(tr);
  table.append(tHead);

  //table body
  let tBody = document.createElement("tbody");
  for (const doc of documents) {
    let tr = document.createElement("tr");

    for (const val in doc) {
      console.log("value in doc", val);
      let td = document.createElement("td");
      td.textContent = doc[val];
      tr.append(td);
    }
    const buttonUpdate = document.createElement("button");
    buttonUpdate.textContent = "update";
    tr.append(buttonUpdate);

    const buttonDelete = document.createElement("button");
    buttonDelete.textContent = "delete";
    buttonDelete.onclick = event => {
      console.log("entro al on click");
      event.preventDefault();
      onDeleteDocument(doc["_id"]);
    };
    tr.append(buttonDelete);

    tBody.append(tr);
  }
  table.append(tBody);
};

function onDeleteDocument(id) {
  const dbName = document.querySelector("#chose-database").value;
  const collName = targetCollection.value;
  console.log("Vamos a eliminar con id: ", id);
  fetch(`./database/${dbName}/${collName}/${id}`, {
    method: "DELETE"
  })
    .then(()=> onCollectionSelection());
}

function onCollectionSelection() {
  const dbName = document.querySelector("#chose-database").value;
  const collName = targetCollection.value;
  console.log("entre a onCollectionSelection!!!!!");
  fetch(`./database/${dbName}/${collName}`)
    .then(res => res.json())
    .then(renderDocuments)
    .catch(() => {
      const div = document.createElement("div");
      div.className = "alert alert-danger";
      div.textContent = "Error downloading data";
      document.getElementById("coll").append(div);
    });
}

targetCollection.addEventListener("change", onCollectionSelection);
