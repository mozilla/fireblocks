// adds a new default row to the table and saves it to storage
function addNewRow(table, replacees) {
  const lastId = replacees.length > 0 ? replacees[replacees.length - 1].id : 0;
  const newRow = {
    id: lastId + 1,
    enable: false,
    target: "",
    replaceWith: "Custom",
    replacement: "",
    replaceOption: "Block just phrase",
    caseSensitive: false,
    smartCase: false,
  };
  table.addRow(newRow);
  replacees.push(newRow);
  browser.storage.local.set({ replacees: replacees });
}

// deletes the specified row from the table and storage
function deleteRow(row, replacees) {
  row.delete();
  const index = replacees.findIndex((item) => item.id === row.getData().id);
  if (index > -1) {
    replacees.splice(index, 1);
    browser.storage.local.set({ replacees: replacees });
  }
}

// saves the data from the table to storage
function saveData(cell, replacees) {
  const rowData = cell.getRow().getData();
  const index = replacees.findIndex((item) => item.id === rowData.id);
  if (index > -1) {
    replacees[index] = rowData;
    browser.storage.local.set({ replacees: replacees });
    // send a message to the content script to update the page
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { rowData });
    });
  }
}

// copy the text to the clipboard
function copyToClipboard(text) {
  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  navigator.clipboard.writeText(text);
  document.body.removeChild(dummy);
}
