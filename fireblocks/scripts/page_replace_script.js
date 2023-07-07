// Replaces the page that contains the block phrase with a replacement
// where the replacement repeats to match the number of words
function replacePage(rootNode, replacee) {
  const regexFlags = replacee.caseSensitive ? "gu" : "gui";
  const regex = new RegExp(replacee.target, regexFlags);
  if (!rootNode.textContent.match(regex)) {
    return;
  }

  // black out all media
  const media = document.querySelectorAll("img, video");
  media.forEach((element) => {
    element.style.filter = "brightness(0%) contrast(0%)";
  });

  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let textNode;
  while ((textNode = walker.nextNode())) {
    if (replacee.replaceWith === "redact") {
      textNode.textContent = redactReplace(textNode.textContent);
    } else if (replacee.replaceWith === "custom") {
      // filter out newlines, whitespace, and so on so that they
      // don't get replaced and mess up the page format
      if (!textNode.textContent.match(/[a-zA-Z0-9\-]/)) {
        continue;
      }
      console.log("node", textNode);
      textNode.textContent = replaceByWord(
        textNode.textContent.trim(),
        replacee.replacement,
        replacee.smartCase
      );
    }
  }
}
