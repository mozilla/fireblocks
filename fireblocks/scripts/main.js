// Route the replacee to the appropriate replacement function
function doReplacement(node, replacee) {
  switch (replacee.replaceOption) {
    case "page":
      replacePage(node, replacee);
      observeChanges(node, replacee, replacePage);
    case "block-phrase-only":
      replaceBlockPhraseOnly(node, replacee);
      observeChanges(node, replacee, replaceBlockPhraseOnly);
    case "context":
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
      console.log("replacing", replacee);
      doReplacement(document.body, replacee);
      doReplacement(document.head, replacee);
    });
  });
}

// runs on page load
startReplacement();