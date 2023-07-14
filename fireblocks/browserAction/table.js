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
      { title: "Target", field: "target", editor: "input", width: 150 },
      {
        title: "Replace With",
        field: "replaceWith",
        editor: "list",
        width: 128,
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
        editor: replacementEditor,
        editable: function (cell) {
          const selectValue = cell.getRow().getCell("replaceWith").getValue();
          return selectValue === "Custom";
        },
      },
      {
        title: "Replace Option",
        field: "replaceOption",
        editor: "list",
        editorParams: {
          values: {
            "Eliminate Block Phrase": "Eliminate Block Phrase",
            "Destroy Context": "Destroy Context",
            "Obliterate Entire Page": "Obliterate Entire Page",
          },
        },
        // if the value is obliterate page, give an alert saying it
        // make break some pages
        cellEdited: function (cell) {
          const selectValue = cell.getValue();
          if (selectValue === "Obliterate Entire Page") {
            alert(
              "Warning: This option may break some pages. Use with caution."
            );
          }
        },
      },
      {
        title: "Case Sensitive",
        field: "caseSensitive",
        formatter: "tickCross",
        editor: true,
        hozAlign: "center",
      },
      {
        title: "Smart Case",
        field: "smartCase",
        formatter: "tickCross",
        editor: true,
        hozAlign: "center",
      },
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
          });
          return deleteButton;
        },
        width: 10,
        hozAlign: "center",
        headerSort: false,
      },
    ],
    data: replacees,
    layout: "fitDataTable",
    resizableColumns: true,
  });
}
