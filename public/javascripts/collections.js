const targetCollection = document.querySelector("#chose-collection");

const renderDocuments = documents => {
  console.log("got documents", documents);
  const target = document.getElementById("coll");
  target.innerHTML = "";
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
    buttonUpdate.onclick = event => {
      console.log("entro al onclick de update");
      event.preventDefault;
      onUpdateDocument(doc);
    };
    tr.append(buttonUpdate);

    const buttonDelete = document.createElement("button");
    buttonDelete.textContent = "delete";
    buttonDelete.onclick = event => {
      console.log("entro al onclick de delete");
      event.preventDefault();
      onDeleteDocument(doc["_id"]);
    };
    tr.append(buttonDelete);

    tBody.append(tr);
  }
  table.append(tBody);

  //create button
  const buttonCreate = document.createElement("button");
  buttonCreate.textContent = "add new document";
  buttonCreate.onclick = event => {
    console.log("entro al onclick de create");
    event.preventDefault;
    onCreateDocument(documents[0]);
  };
  target.append(buttonCreate);
};


function updateDocument(doc){
  console.log("Se va a actualizar un documento");
  const dbName = document.querySelector("#chose-database").value;
  const collName = targetCollection.value;
  const id=doc["_id"];
  console.log("id del documento", id);

  return event => {
    event.preventDefault();
    let doc = {};
    let inputs = document.querySelectorAll(
      "#form-div form input"
    );
    for (const data of inputs) {
      console.log("input value: " , data.value);
      doc[data.labels[0].textContent] = data.value;
    }
    fetch(`./database/${dbName}/${collName}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doc)
    })
      .then(res => res.json())
      .then(doc => {
        console.log("result",doc);
        onCollectionSelection();
      })
      .catch(() => {
        const div = document.createElement("div");
        div.className = "alert alert-danger";
        div.textContent = "Error downloading data";
        document.getElementById("coll").append(div);
      });
  };

}

function createDocument() {
  console.log("Se va a crear un documento");
  const dbName = document.querySelector("#chose-database").value;
  const collName = targetCollection.value;

  return event => {
    event.preventDefault();
    let doc = {};
    let inputs = document.querySelectorAll(
      "#form-div form input"
    );
    for (const data of inputs) {
      console.log("input value: " , data.value);
      doc[data.labels[0].textContent] = data.value;
    }
    fetch(`./database/${dbName}/${collName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doc)
    })
      .then(res => res.json())
      .then(doc => {
        console.log("result",doc);
        onCollectionSelection();
      })
      .catch(() => {
        const div = document.createElement("div");
        div.className = "alert alert-danger";
        div.textContent = "Error downloading data";
        document.getElementById("coll").append(div);
      });
  };
}

function onCreateDocument(doc) {
  console.log("entro al onCreate", doc);
  const target = document.getElementById("form-div");
  target.innerHTML = "";

  const type = document.createElement("h2");
  type.textContent = "Create Document";
  target.append(type);

  const form = document.createElement("form");
  form.innerHTML ="";
  for (const key in doc) {
    console.log("key of create", key);
    if (key !== "_id") {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = key;
      const input = document.createElement("input");
      input.type = "text";
      input.name = key;
      input.id = key;

      label.append(span);
      label.append(input);

      form.append(label);
    }
  }
  form.addEventListener("submit", createDocument());
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "create";
  form.append(button);
  target.append(form);
}

function onUpdateDocument(doc) {
  console.log("entro al onUpdate", doc);
  const target = document.getElementById("form-div");
  target.innerHTML = "";

  const type = document.createElement("h2");
  type.textContent = "Update Document";
  target.append(type);

  const form = document.createElement("form");
  form.innerHTML ="";
  for (const key in doc) {
    console.log("key of create", key);
    if (key !== "_id") {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = key;
      const input = document.createElement("input");
      input.type = "text";
      input.name = key;
      input.id = key;

      label.append(span);
      label.append(input);

      form.append(label);
    }
  }
  form.addEventListener("submit", updateDocument(doc));
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "update";
  form.append(button);
  target.append(form);
}

function onDeleteDocument(id) {
  const dbName = document.querySelector("#chose-database").value;
  const collName = targetCollection.value;
  console.log("Vamos a eliminar con id: ", id);
  fetch(`./database/${dbName}/${collName}/${id}`, {
    method: "DELETE"
  }).then(() => onCollectionSelection());
}

function onCollectionSelection() {
  const dbName = document.querySelector("#chose-database").value;
  const collName = targetCollection.value;

  const target = document.getElementById("form-div");
  target.innerHTML = "";

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
