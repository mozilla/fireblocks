browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
  
    console.log(replacees);
  
    var table = new Tabulator("#phrase-table", {
      columns: [
        { title: "Target", field: "target", editor: "input", width: 100 },
        {
          title: "Replace With",
          field: "replaceWith",
          editor: "list",
          editorParams: { values: { redact: "Redact", custom: "Custom" } },
        },
        { title: "Replacement", field: "replacement", editor: "input" },
        {
          title: "Replace Option",
          field: "replaceOption",
          editor: "select",
          editorParams: {
            values: {
              option1: "Option 1",
              option2: "Option 2",
              option3: "Option 3",
            },
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
      ],
      data: replacees,
      layout: "fitDataTable",
      resizableColumns: true,
    });
  });
  