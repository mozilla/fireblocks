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

startReplacement();