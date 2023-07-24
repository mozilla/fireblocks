// makes the tabulator table object with custom logic for some
// of the columns
function makeTable(replacees) {
  // make a different editor for the "custom replacement" column
  // that changes the behaviour itself depending on the value of
  // the "replaceWith" column
  function replacementEditor(cell, onRendered, success, cancel) {
    const selectValue = cell.getRow().getCell("replaceWith").getValue();
    // if custom, allow for editing
    if (selectValue === "Custom") {
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
      // if redact, don't allow editing
    } else {
      success(cell.getValue());
    }
  }

  // when the block phrase cell is empty, grey out the text and italicize it
  const blockPhrasePlaceholderInput = function (cell, formatterParams) {
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
      cell.getRow().getData()["replaceWith"] === "Custom"
    ) {
      cell.getElement().style.color = "#999";
      cell.getElement().style.fontStyle = "italic";
      return "enter replacement";
    } else if (
      cellValue === "" &&
      cell.getRow().getData()["replaceWith"] === "Redact"
    ) {
      cell.getElement().style.color = "#999";
      cell.getElement().style.fontStyle = "italic";
      return "N/A: using redact";
    } else {
      //remove the greyed out text and italics
      cell.getElement().style.color = "";
      cell.getElement().style.fontStyle = "";
      return cellValue;
    }
  };

  return new Tabulator("#phrase-table", {
    columns: [
      {
        title: "Enable",
        field: "enable",
        formatter: "tickCross",
        editor: true,
        hozAlign: "center",
        width: 87,
      },
      {
        title: "Block Phrase",
        field: "target",
        formatter: blockPhrasePlaceholderInput,
        editor: "input",
        width: 170,
      },
      {
        title: "Replace With",
        field: "replaceWith",
        editor: "list",
        editorParams: { values: { Redact: "Redact", Custom: "Custom" } },
        cellEdited: function (cell) {
          // if redact, clear the custom replacement cell
          const replaceWithValue = cell.getValue();
          if (replaceWithValue === "Redact") {
            const replacementCell = cell.getRow().getCell("replacement");
            replacementCell.setValue("");
            saveData(replacementCell, replacees);
          }
        },
      },
      {
        title: "Custom Replacement",
        field: "replacement",
        formatter: replacementPlaceholderInput,
        editor: replacementEditor,
        editable: function (cell) {
          const selectValue = cell.getRow().getCell("replaceWith").getValue();
          return selectValue === "Custom";
        },
        width: 180,
      },
      {
        title: "Replace Option",
        field: "replaceOption",
        editor: "list",
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
      // {
      //   title: "Case Sensitive",
      //   field: "caseSensitive",
      //   formatter: "tickCross",
      //   editor: true,
      //   hozAlign: "center",
      // },
      // {
      //   title: "Smart Case",
      //   field: "smartCase",
      //   formatter: "tickCross",
      //   editor: true,
      //   hozAlign: "center",
      // },
      {
        title: "",
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
              document.getElementsByClassName(
                "clipboard-container"
              )[0].style.display = "none";
            }
          });
          return deleteButton;
        },
        hozAlign: "center",
        headerSort: false,
      },
    ],
    data: replacees,
    layout: "fitDataFill",
    resizableColumns: true,
  });
}
