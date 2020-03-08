const targetDB = document.querySelector("#chose-database");

const renderCollections = collections => {
  console.log("got collections", collections);
  let selectedCollection = document.querySelector("#chose-collection");
  selectedCollection.innerHTML = "";
  for (const collec of collections) {
    const option = document.createElement("option");
    option.setAttribute("value", collec.name);
    option.textContent = collec.name;
    selectedCollection.append(option);
  }
};

function onDBSelection() {
  //Original component
  const dateDiv = document.getElementById("show-dbs");
  dateDiv.innerHTML = Date();



  let dbName = targetDB.value;
  console.log("Data Base selected", dbName);
  let selectedCollection = document.querySelector("#chose-collection");

  if (dbName !== "no data") {
    fetch(`./database/${dbName}`)
      .then(res => res.json())
      .then(renderCollections)
      .catch(() => {
        const div = document.createElement("div");
        div.className = "alert alert-danger";
        div.textContent = "Error downloading data";
        document.getElementById("coll").append(div);
      });
  } else {
    selectedCollection.innerHTML = "Select a type of animal";
  }
}

targetDB.addEventListener("change", onDBSelection);


