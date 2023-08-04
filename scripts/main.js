// Route the replacee to the appropriate replacement function
function doReplacement(node, replacee) {
  switch (replacee.replaceOption) {
    case "Block entire page":
      replacePage(node, replacee);
      if (!isSubsetString(replacee.target, replacee.replacement)) {
        observeChanges(node, replacee, replacePage);
      }
      return;
    case "Block just phrase":
      if (!isSubsetString(replacee.target, replacee.replacement)) {
        replaceBlockPhraseOnly(node, replacee);
        observeChanges(node, replacee, replaceBlockPhraseOnly);
      } else {
        replaceBlockPhraseTextOnly(node, replacee);
      }
      return;
    case "Block entire section":
      if (!isSubsetString(replacee.target, replacee.replacement)) {
        replaceContext(node, replacee);
        observeChanges(node, replacee, replaceContext);
      } else {
        replaceContextText(node, replacee);
      }
      return;
  }
}


// Retrieve all replacees from storage and replace the body
// and head of the page for each
function startReplacement() {
  browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
    replacees.forEach((replacee) => {
      if (replacee.enable && replacee.target && replacee.replacement) {
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
  if (message.rowData && message.rowData.enable && message.rowData.target && message.rowData.replacement) {
    doReplacement(document.body, message.rowData);
    doReplacement(document.head, message.rowData);
  }
});
