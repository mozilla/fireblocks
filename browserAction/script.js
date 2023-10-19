/*
 *
 * TABLE SETUP
 *
 */

// fetch the data and create the table on page load
browser.storage.local.get("replacees").then((result) => {
  const replacees = result.replacees || [];
  const table = makeTable(replacees);
  // if table is empty, do not show the table
  if (replacees.length === 0) {
    document.getElementById("phrase-table").style.maxHeight = "0px";
  }

  // Save on edit, disallow cells with more than 75 characters
  table.on("cellEdited", function (cell) {
    const target = cell.getRow().getCell("target").getValue();
    const replacement = cell.getRow().getCell("replacement").getValue();
    if (target.length > 75 || replacement.length > 75) {
      alert("Cell must be 75 characters or less.");
      cell.setValue(cell.getValue().substring(0, 75));
      return;
    }

    cell.getRow().getCell("target").setValue(target.trim());
    saveData(cell, replacees);
  });

  // add phrase button adds new row and shows table if it was hidden
  const addButton = document.getElementsByClassName("add-row-button");
  addButton[0].addEventListener("click", function () {
    document.getElementById("phrase-table").style.maxHeight = "350px";
    addNewRow(table, replacees);
  });
});
