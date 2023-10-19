// make a different editor for the "custom replacement" column
// that changes the behaviour itself depending on the value of
// the "replaceWith" column
function replacementEditor(cell, onRendered, success, cancel) {
  const selectValue = cell.getRow().getCell("replaceWith").getValue();
  // if custom, allow for editing
  if (selectValue === "Text (Custom)") {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", cell.getValue());
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    onRendered(function () {
      input.focus();
      input.style.height = "100%";
    });

    function onChange() {
      if (input.value !== cell.getValue()) {
        success(input.value);
      } else {
        cancel();
      }
    }

    input.addEventListener("change", onChange);
    input.addEventListener("blur", onChange);

    return input;
    // if redact (custom), make this box a dropdown menu
  } else if (selectValue === "Redact (Custom)") {
    const select = document.createElement("select");
    const options = [
      "\u{1F480}\u{1F480}\u{1F480}", // skull
      "\u{1F4A9}\u{1F4A9}\u{1F4A9}", // poop
      "\u{1F921}\u{1F921}\u{1F921}", // clown
      "\u{1F346}\u{1F346}\u{1F346}", // eggplant
      "\u{1F92C}\u{1F92C}\u{1F92C}", // face censored
      "\u{1F44E}\u{1F44E}\u{1F44E}", // thumbs down
      "\u{2588}\u{2588}\u{2588}", //  █
    ];

    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.text = option;
      select.appendChild(opt);
    });

    select.style.width = "100%";
    select.style.boxSizing = "border-box";
    select.style.height = "100%";
    select.style.textAlign = "center";

    select.value = cell.getValue() ? cell.getValue() : "\u{2588}\u{2588}\u{2588}";

    onRendered(function () {
      select.focus();
    });

    function onChange() {
      if (select.value !== cell.getValue()) {
        success(select.value);
      } else {
        cancel();
      }
    }
    select.addEventListener("change", onChange);
    select.addEventListener("blur", onChange);
    return select;
  }
}

// when the block phrase cell is empty, grey out the text and italicize it
const blockPhrasePlaceholderInput = function (cell) {
  const cellValue = cell.getValue();
  if (cellValue === "") {
    // grey out text and italicize it
    cell.getElement().style.color = "#999";
    cell.getElement().style.fontStyle = "italic";
    return "enter phrase to block";
  } else {
    //remove the greyed out text and italics
    cell.getElement().style.color = "";
    cell.getElement().style.fontStyle = "";
    return cellValue;
  }
};

// when the replacement cell is empty, grey out the text and italicize it
// based on the replaceWith column
const replacementPlaceholderInput = function (cell) {
  const cellValue = cell.getValue();
  if (
    cellValue === "" &&
    cell.getRow().getData()["replaceWith"] === "Text (Custom)"
  ) {
    cell.getElement().style.color = "#999";
    cell.getElement().style.fontStyle = "italic";
    return "enter replacement";
  } else if (
    cellValue === "" &&
    cell.getRow().getData()["replaceWith"] === "Redact (Custom)"
  ) {
    cell.getElement().style.color = "#999";
    cell.getElement().style.fontStyle = "italic";
    return "click to choose symbol";
  } else {
    //remove the greyed out text and italics
    cell.getElement().style.color = "";
    cell.getElement().style.fontStyle = "";
    return cellValue;
  }
};

// makes the tabulator table object with custom logic for some
// of the columns
function makeTable(replacees) {
  return new Tabulator("#phrase-table", {
    columns: [
      {
        title: "Block Phrase",
        field: "target",
        formatter: blockPhrasePlaceholderInput,
        editor: "input",
        resizable: false,
        width: 140,
      },
      {
        title: "Replace With",
        field: "replaceWith",
        editor: "list",
        resizable: false,
        editorParams: {
          values: {
            "Redact (Custom)": "Redact (Custom)",
            "Text (Custom)": "Text (Custom)",
          },
        },
        cellEdited: function (cell) {
          cell.getRow().getCell("replacement").setValue("");
        },
      },
      {
        title: "Custom Replacement",
        field: "replacement",
        resizable: false,
        formatter: replacementPlaceholderInput,
        editor: replacementEditor,
        width: 180,
      },
      {
        title: "Replace Option",
        field: "replaceOption",
        editor: "list",
        resizable: false,
        editorParams: {
          values: {
            "Block just phrase": "Block just phrase",
            "Block entire section": "Block entire section",
            "Block entire page": "Block entire page",
          },
        },
        // if the value is obliterate page, give an alert saying it
        // make break some pages
        cellEdited: function (cell) {
          const selectValue = cell.getValue();
          if (selectValue === "Block entire page") {
            alert(
              "Warning: This option may break some pages. Use with caution."
            );
          }
        },
      },
      {
        title: "Enable",
        field: "enable",
        formatter: "tickCross",
        editor: true,
        resizable: false,
        hozAlign: "center",
      },
      {
        formatter: function (cell) {
          // delete buttons behaviour
          const deleteButton = document.createElement("i");
          deleteButton.classList.add("bi");
          deleteButton.classList.add("bi-trash3");
          deleteButton.classList.add("remove-button");
          deleteButton.addEventListener("click", function () {
            deleteRow(cell.getRow(), replacees);
            // if table is empty, hide it
            if (replacees.length === 0) {
              document.getElementById("phrase-table").style.maxHeight = "0px";
            }
          });
          return deleteButton;
        },
        hozAlign: "center",
        resizable: false,
        headerSort: false,
      },
      {
        title: "",
        headerSort: false,
        resizable: false,
      },
    ],
    data: replacees,
    layout: "fitDataFill",
    resizableColumns: true,
  });
}
