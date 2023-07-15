// Route the replacee to the appropriate replacement function
function doReplacement(node, replacee) {
  switch (replacee.replaceOption) {
    case "Obliterate Entire Page":
      replacePage(node, replacee);
      observeChanges(node, replacee, replacePage);
    case "Eliminate Block Phrase":
      replaceBlockPhraseOnly(node, replacee);
      observeChanges(node, replacee, replaceBlockPhraseOnly);
    case "Destroy Context":
      replaceContext(node, replacee);
      observeChanges(node, replacee, replaceContext);
  }
}

// Retrieve all replacees from storage and replace the body
// and head of the page for each
function startReplacement() {
  browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
    replacees.forEach((replacee) => {
      if (replacee.enable && replacee.target) {
      doReplacement(document.body, replacee);
      doReplacement(document.head, replacee);
      }
    });
  });
}

// runs on page load
startReplacement();

// listen for a message for editing a replacee
browser.runtime.onMessage.addListener((message) => {
  if (message.rowData && message.rowData.enable && message.rowData.target) {
    doReplacement(document.body, message.rowData);
    doReplacement(document.head, message.rowData);
  }
});