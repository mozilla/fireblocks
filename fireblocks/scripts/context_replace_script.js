// Recursively replace at most the sentence that contains the
// block phrase with a replacement.
function contextReplaceWith(text, replacee) {
  let sentence;
  let regexFlags = replacee.caseSensitive ? "g" : "gi";
  const regex = new RegExp(replacee.target, regexFlags);

  text.replace(regex, function (match) {
    const [startIndex, endIndex] = findSentenceStartAndEnd(text, match);
    if (replacee.replaceWith === "redact") {
      const redactedSentence = redactReplace(text.slice(startIndex, endIndex));
      sentence =
        redactedSentence + contextReplaceWith(text.slice(endIndex), replacee);
    } else if (replacee.replaceWith === "custom") {
      const sentenceFound = text.slice(startIndex, endIndex);
      const replacement = replaceByWord(
        sentenceFound,
        replacee.replacement,
        replacee.smartCase
      );
      sentence =
        replacement + contextReplaceWith(text.slice(endIndex), replacee);
    }
  });
  return sentence ? sentence + " " : text;
}

// Replaces all instances of replacee.target with replacee.replacement
// rootNode: the root node to search for text nodes
function replaceContext(rootNode, replacee) {
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );

  const regexFlags = replacee.caseSensitive ? "gu" : "gui";
  const regex = new RegExp(replacee.target, regexFlags);
  const stragglerArray = [];

  let node;
  while ((node = walker.nextNode())) {
    // replace inputs, images, and videos and ignore breaking nodes
    if (node.nodeName === "INPUT") {
      node.value.replace(regex, (match) => {
        node.value = contextReplaceWith(match, replacee);
      });
      continue;
    } else if (node.nodeName === "IMG" || node.nodeName === "VIDEO") {
      if (node.alt && node.alt.match(regex)) {
        node.style.filter = "brightness(0%) contrast(0%)";
      }
    } else if (
      ["SCRIPT", "STYLE", "MAIN"].includes(node.nodeName) ||
      !node.textContent
    ) {
      continue;
    }

    const textHasPhrase = node.textContent.match(regex);

    // If the block phrase exists, replace it bottom up
    if (textHasPhrase) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.replace(regex, () => {
            child.textContent = contextReplaceWith(
              child.textContent,
              replacee,
              child
            );
          });
        } else {
          replaceContext(child, replacee);
        }
      });

      // Replace later those that were not replaced because
      // the text was not updated
      const textStillHasSome = node.textContent.match(regex);
      if (textStillHasSome) {
        if (node.nodeName !== "DIV") {
          stragglerArray.push(node);
        }
      }
    }
  }
  replaceStragglers(stragglerArray.reverse(), replacee);
}
