// Works as a redirector for the type of replacement
function blockReplaceWith(match, replacee) {
  if (replacee.replaceWith === "Redact") {
    return redactReplace(match);
  } else if (replacee.replaceWith === "Custom") {
    if (replacee.smartCase) {
      return smartCaseReplace(match, replacee.replacement);
    } else {
      return replacee.replacement;
    }
  }
}

// Replaces all instances of replacee.target with replacee.replacement
// rootNode: the root node to search for text nodes
function replaceBlockPhraseOnly(rootNode, replacee) {
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
      node.value = node.value.replace(regex, (match) => {
        return blockReplaceWith(match, replacee);
      });
      continue;
    } else if (node.nodeName === "IMG" || node.nodeName === "VIDEO") {
      if (node.alt && node.alt.match(regex)) {
        node.style.filter = "brightness(0%) contrast(0%)";
      }
    } else if (
      ["SCRIPT", "STYLE", "MAIN", "NOSCRIPT"].includes(node.nodeName) ||
      !node.textContent
    ) {
      continue;
    }

    const textHasPhrase = node.textContent.match(regex);

    // If the block phrase exists, replace it bottom up
    if (textHasPhrase) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.replace(regex, (match) => {
            blockReplaceWith(match, replacee);
          });
        } else {
          replaceBlockPhraseOnly(child, replacee);
        }
      });

      // For cases such as "block <b>phrase</b>" where the block phrase
      // is split among nodes, these are caught here. However, sometimes,
      // for some reason, the replaces text has not updated yet, so we
      // add it to the straggler array to be replaced later (when it's updated)
      const textStillHasSome = node.textContent.match(regex);
      if (textStillHasSome) {
        // Divs will break very often, so ignore them.
        if (node.nodeName !== "DIV") {
          stragglerArray.push(node);
        }
      }
    }
  }

  // Reverse the array so that we replace the deepest nodes first
  replaceStragglers(stragglerArray.reverse(), replacee);
}
