/*
 *
 * CLIPBOARD BUTTONS
 *
 */

// make the clipboard buttons containing the prefab phrases.
const clipboardButtons = [
  "\uD83D\uDCA9", // poop
  "!!! SPOILER ALERT !!!",
  "\uD83E\uDD21", // clown
  "!!! WARNING !!!",
  "\uD83D\uDC80", // skull
  "!!! CENSORED !!!",
  "\uD83D\uDC4E", // thumbs down
  "NOPE, NOT TODAY",
  "\u2605\u2605\u2605\u2605\u2605", // 5 stars
  "\u2605\u2606\u2606\u2606\u2606", // 1 star out of 5
  "%$#@!",
  "\uD83C\uDF46", // eggplant
];

const clipboardContainer = document.getElementsByClassName(
  "clipboard-container"
)[0];

clipboardButtons.forEach((button) => {
  const newButton = document.createElement("button");
  newButton.className = "btn btn-outline-info";
  const iTag = document.createElement("i");
  iTag.className = "bi bi-clipboard";
  newButton.appendChild(iTag);
  const buttonText = document.createTextNode(" " + button);
  newButton.appendChild(buttonText);
  clipboardContainer.appendChild(newButton);
});

// let the user easily copy the pre-made phrases
const copyButtons = document.getElementsByClassName("btn-outline-info");
Array.from(copyButtons).forEach((button) => {
  button.addEventListener("click", function () {
    // replace the clipboard icon with a checkmark for a second
    const iTag = button.getElementsByTagName("i")[0];
    iTag.classList.remove("bi-clipboard");
    iTag.classList.add("bi-check2");
    setTimeout(function () {
      iTag.classList.remove("bi-check2");
      iTag.classList.add("bi-clipboard");
    }, 1500);

    const text = button.innerText;
    copyToClipboard(text.trim());
  });
});

/*
 *
 * TABLE SETUP
 *
 */

// fetch the data and create the table on page load
browser.storage.local.get("replacees").then((result) => {
  const replacees = result.replacees || [];
  const table = makeTable(replacees);

  // Save on edit, disallow cells with more than 75 characters
  table.on("cellEdited", function (cell) {
    const target = cell.getRow().getCell("target").getValue();
    const replacement = cell.getRow().getCell("replacement").getValue();
    if (target.length > 75 || replacement.length > 75) {
      alert("Cell must be 75 characters or less.");
      cell.setValue(cell.getValue().substring(0, 75));
      return;
    }

    cell.getRow().getCell("replacement").setValue(replacement.trim());
    cell.getRow().getCell("target").setValue(target.trim());
    saveData(cell, replacees);
  });

  // add phrase button adds new row
  const addButton = document.getElementsByClassName("add-row-button");
  addButton[0].addEventListener("click", function () {
    addNewRow(table, replacees);
  });

  // enable all button enables all rows
  const enableAllButton = document.getElementsByClassName("enable-all-button");
  enableAllButton[0].addEventListener("click", function () {
    table.getRows().forEach(function (row) {
      row.update({ enable: true });
      saveData(row.getCell("enable"), replacees);
    });
  });

  // disable all button disables all rows
  const disableAllButton =
    document.getElementsByClassName("disable-all-button");
  disableAllButton[0].addEventListener("click", function () {
    table.getRows().forEach(function (row) {
      row.update({ enable: false });
      saveData(row.getCell("enable"), replacees);
    });
  });
});
