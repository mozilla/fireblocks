// Replace the text with the replacer, but ensure that
// the casing and punctuation of the original text is preserved
function smartCaseReplace(replaceeText, replacerText) {
  const capitalIndices = [];
  const punctuationLocations = {}

  // Gather the indices of capital letters and punctuation
  for (let i = 0; i < replaceeText.length; i++) {
    if (replaceeText[i].match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)) {
      punctuationLocations[i] = replaceeText[i];
    } else if (replaceeText[i].toUpperCase() === replaceeText[i]) {
      capitalIndices.push(i);
    }
  }

  let replacement = replacerText;

  // Replace caps
  for (let i = 0; i < capitalIndices.length; i++) {
    const index = capitalIndices[i];
    if (index < replacement.length) {
      replacement =
        replacement.slice(0, index) +
        replacement[index].toUpperCase() +
        replacement.slice(index + 1);
    } else {
      break;
    }
  }

  // Replace punctuation
  for (let i = 0; i < punctuationLocations.length; i++) {
    const index = i;
    if (index < replacement.length) {
      replacement =
        replacement.slice(0, index) +
        punctuationLocations[index] +
        replacement.slice(index + 1);
    } else {
      break;
    }
  }
  return replacement;
}

// Replaces all alphanumeric characters with a black square
function redactReplace(replaceeText) {
  let replacement = "";
  for (let i = 0; i < replaceeText.length; i++) {
    if (!replaceeText[i].match(/[a-z0-9]/i)) {
      replacement += replaceeText[i];
    } else {
      replacement += "█";
    }
  }
  return replacement;
}

// Replaces solely the block phrase with the replacement
function replaceBlockPhraseOnly(node, replacee) {
  let text = node.textContent;

  let regexFlags = "gu";
  if (!replacee.caseSensitive) {
    regexFlags += "i";
  }
  const regex = new RegExp(replacee.target, regexFlags);

  if (replacee.replaceWith === "redact") {
    node.textContent = text.replace(regex, redactReplace);
  } else if (replacee.replaceWith === "blur") {
    return;
  } else if (replacee.replaceWith === "custom") {
    node.textContent = text.replace(regex, function (match) {
      if (replacee.smartCase) {
        return smartCaseReplace(match, replacee.replacement);
      } else {
        return replacee.replacement;
      }
    });
  }
}

// Replaces the text given (i.e. an entire sentence or paragraph that contians
// the block phrase) with the replacement where the replacement repeats
// to match the number of words in the text
function replaceByWord(text, replacement, smartCase) {
  const textWords = text.split(" ");
  const replacementWords = replacement.split(" ");
  const numTextWords = textWords.length;
  const numReplacementWords = replacementWords.length;
  let newSentence = "";
  if (smartCase) {
    for (let i = 0; i < numTextWords; i++) {
      const textWord = textWords[i];
      const replacementWord = replacementWords[i % numReplacementWords];
      newSentence += smartCaseReplace(textWord, replacementWord.toLowerCase()) + " ";
    }
  } else {
    for (let i = 0; i < numTextWords; i++) {
      newSentence += replacementWords[i % numReplacementWords] + " ";
    }
  }

  // We want to replace the block phrase with at least 1 instance
  // of the replacement
  if (newSentence.length < replacement.length) {
    newSentence = replacement;
  }
  return newSentence;
}

function findSentenceStartAndEnd(text, match) {
  const matchIndex = text.indexOf(match);
  let startIndex = matchIndex;
  let endIndex = matchIndex + match.length;
  while (startIndex > 0 && text[startIndex] !== ".") {
    startIndex--;
  }
  while (endIndex < text.length && text[endIndex] !== ".") {
    endIndex++;
  }
  return [startIndex, endIndex];
}

// Replaces the sentence that contains the block phrase with a replacement
// where the replacement repeats to match the number of words or characters
function replaceSentence(node, replacee) {
  let text = node.textContent;

  let regexFlags = "gu";
  if (!replacee.caseSensitive) {
    regexFlags += "i";
  }
  const regex = new RegExp(replacee.target, regexFlags);

  if (replacee.replaceWith === "redact") {
    let startIndex;
    let endIndex;
    const newSentence = text.replaceAll(regex, function (match) {
      const [startIndex, endIndex] = findSentenceStartAndEnd(text, match);
      return redactReplace(text.slice(startIndex, endIndex));
    });
    node.textContent = node.textContent.replace(
      text.slice(startIndex, endIndex),
      newSentence
    );
  } else if (replacee.replaceWith === "blur") {
    return;
  } else if (replacee.replaceWith === "custom") {
    let startIndex;
    let endIndex;
    const newSentence = text.replaceAll(regex, function (match) {
      const [startIndex, endIndex] = findSentenceStartAndEnd(text, match);
      return replaceByWord(
        text.slice(startIndex, endIndex),
        replacee.replacement,
        replacee.smartCase
      );
    });
    node.textContent = node.textContent.replace(
      text.slice(startIndex, endIndex),
      newSentence
    );
  }
}

// Replaces the paragraph that contains the block phrase with a replacement
// where the replacement repeats to match the number of words or characters
function replaceParagraph(node, replacee) {
  let text = node.textContent;

  let regexFlags = "gu";
  if (!replacee.caseSensitive) {
    regexFlags += "i";
  }
  const regex = new RegExp(replacee.target, regexFlags);

  if (replacee.replaceWith === "redact") {
    node.textContent = text.replace(regex, function (match) {
      return redactReplace(text);
    });
  }
}

// Replaces the page that contains the block phrase with a replacement
// where the replacement repeats to match the number of words or characters
function replacePage(node, replacee) {}

// Replaces all instances of replacee.target with replacee.replacement
// rootNode: the root node to search for text nodes
function replaceText(rootNode, replacee) {
  const nodeTreeWalker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (nodeTreeWalker.nextNode()) {
    const node = nodeTreeWalker.currentNode;

    if (node.parentNode.tagName === "SCRIPT") {
      continue;
    }

    if (replacee.replaceOption === "block-phrase-only") {
      replaceBlockPhraseOnly(node, replacee);
    } else if (replacee.replaceOption === "sentence") {
      replaceSentence(node, replacee);
    } else if (replacee.replaceOption === "paragraph") {
      replaceParagraph(node, replacee);
    } else if (replacee.replaceOption === "page") {
      replacePage(node, replacee);
    }
  }
}

// Gets the replacees from storage and replaces the
// body and head
function doReplacement() {
  browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
    replacees.forEach((replacee) => {
      console.log("replacing", replacee);
      replaceText(document.body, replacee);
      replaceText(document.head, replacee);
    });
  });
}

// on load
doReplacement();
