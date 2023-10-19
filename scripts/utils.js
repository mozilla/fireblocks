// Observe changes on the nodes for a specific replacee, then
// call the proper function when there are changes to the DOM.
function observeChanges(rootNode, replacee, replaceProtocol) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          replaceProtocol(node, replacee);
        });
      }
    });
  });

  observer.observe(rootNode, {
    childList: true,
    subtree: true,
  });
}

// Replace the text by maintaining the original casing and
// punctuation. So "We'll be FINE" being replace by "banana"
// will result in "Ba'nana banana BANAna" in the case of
// contextReplace
function smartCaseReplace(replaceeText, replacerText) {
  const capitalIndices = [];
  const punctuationLocations = {};

  // Skip if the replacee is only punctuation
  if (replaceeText.match(/^[.,\/#!$%\^&\*;:{}=\-_`~()]+$/g)) {
    return replaceeText;
  }

  // Find the indices of capital letters and punctuation
  for (let i = 0; i < replaceeText.length; i++) {
    if (replaceeText[i].match(/[."',\/#!$%\^&\*;:{}=\-_`~()]/g)) {
      punctuationLocations[i] = replaceeText[i];
    } else if (replaceeText[i].toUpperCase() === replaceeText[i]) {
      capitalIndices.push(i);
    }
  }

  let replacement = replacerText;
  let replacementArr = replacement.split("");

  // Capitalize the replacement letters that were capitalized in the replacee
  capitalIndices.forEach((index) => {
    if (index < replacementArr.length) {
      replacementArr[index] = replacementArr[index].toUpperCase();
    }
  });

  // Add punctuation back in
  for (const key in punctuationLocations) {
    const index = Number(key);
    if (index < replacementArr.length) {
      replacementArr.splice(index, 0, punctuationLocations[key]);
    } else {
      replacementArr.push(punctuationLocations[key]);
    }
  }

  replacement = replacementArr.join("");
  return replacement;
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

  for (let i = 0; i < numTextWords; i++) {
    const textWord = textWords[i];
    const replacementWord = replacementWords[i % numReplacementWords];
    if (!textWord) {
      continue;
    }

    if (smartCase) {
      newSentence +=
        smartCaseReplace(textWord, replacementWord.toLowerCase()) + " ";
    } else {
      newSentence += replacementWord + " ";
    }
  }

  if (newSentence.length < replacement.length) {
    newSentence = replacement;
  }

  return newSentence;
}

// Replaces all alphanumeric characters with a black square.
function redactReplace(replaceeText, redactSymbol) {
  // since we have 3 repeating chars, we only want to use 1/3 of the redactSymbol
  return replaceeText.replace(/[a-zA-ZÀ-ÖØ-öø-ÿ0-9]/g, redactSymbol.substring(0, redactSymbol.length / 3));
}

// Finds the index of the first and last character of the sentence
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

// Replace nodes that did not register as replaced due to
// race conditions.
function replaceStragglers(stragglerArray, replacee) {
  const regexFlags = "i";
  const regex = new RegExp(replacee.target, regexFlags);
  stragglerArray.forEach((node) => {
    if (!node.textContent.match(regex)) {
      return;
    }

    // try to avoid replacing things that look like code
    if (
      node.textContent.match(/\{.*\}.*:.*;.*./) &&
      node.textContent.match(/-/)
    ) {
      return;
    }

    node.textContent = node.textContent.replace(regex, (match) => {
      if (replacee.replaceOption === "Block entire section") {
        return contextReplaceWith(node.textContent, replacee);
      } else if (replacee.replaceOption === "Block just phrase") {
        return blockReplaceWith(match, replacee, node);
      }
    });
  });
}


function isSubsetString(target, replacement) {
  return replacement.includes(target);
}