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
  "\uD83D\uDC80", // skull
  "NOPE, NOT TODAY",
  "\uD83D\uDC4E", // thumbs down
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
    iTag.classList.add("bi-clipboard-check-fill");
    setTimeout(function () {
      iTag.classList.remove("bi-clipboard-check-fill");
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
  // if table is empty, do not show the table
  if (replacees.length === 0) {
    document.getElementById("phrase-table").style.maxHeight = "0px";
    document.getElementsByClassName("clipboard-container")[0].style.display = "none";
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

    cell.getRow().getCell("replacement").setValue(replacement.trim());
    cell.getRow().getCell("target").setValue(target.trim());
    saveData(cell, replacees);
  });

  // add phrase button adds new row and shows table if it was hidden
  const addButton = document.getElementsByClassName("add-row-button");
  addButton[0].addEventListener("click", function () {
    document.getElementById("phrase-table").style.maxHeight = "350px";
    document.getElementsByClassName("clipboard-container")[0].style.display = "flex";
    addNewRow(table, replacees);
  });
});
