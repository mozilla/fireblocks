let modifyingPhraseObj = null;
let modifyingPhraseParent = null;

// Load the list of block phrases into the Modify Block Phrases tabs
function showPhraseList() {
  blockPhraseList.innerHTML = "";
  browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
    replacees.forEach(function (phraseObj) {
      const li = document.createElement("li");

      const modifyButton = document.createElement("button");
      modifyButton.textContent = "Modify";
      modifyButton.addEventListener("click", function () {
        handleModifyPhrase(phraseObj, replacees, li);
      });
      li.appendChild(modifyButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        deletePhrase(phraseObj, replacees);
      });
      li.appendChild(deleteButton);

      const phraseInfo = document.createElement("span");
      phraseInfo.textContent =
        "Target: " +
        phraseObj.target +
        ", Replace With: " +
        (phraseObj.replaceWith === "custom"
          ? phraseObj.replacement
          : phraseObj.replaceWith);
      li.appendChild(phraseInfo);

      blockPhraseList.appendChild(li);
    });
  });
}

// Show the fields of the phrase to be modified under the list item
function handleModifyPhrase(phraseObj, replacees, parentElement) {
  // Only show one modify dropdown at a time
  if (modifyingPhraseObj) {
    clearModifyDropdown();
  }

  modifyingPhraseObj = phraseObj;
  modifyingPhraseParent = parentElement;

  const modifyDropdown = document.createElement("div");
  modifyDropdown.id = "modify-dropdown";

  const modifyForm = document.createElement("form");
  modifyForm.id = "modify-form";

  const modifyHeader = document.createElement("h1");
  modifyHeader.textContent = "Modify Phrase";
  modifyForm.appendChild(modifyHeader);

  // Block Phrase
  const blockPhraseLabel = document.createElement("label");
  blockPhraseLabel.textContent = "Block Phrase:";
  const blockPhraseInput = document.createElement("input");
  blockPhraseInput.id = "block-phrase";
  blockPhraseInput.type = "text";
  blockPhraseInput.value = phraseObj.target;
  blockPhraseLabel.appendChild(blockPhraseInput);
  blockPhraseLabel.appendChild(document.createElement("br"));

  // Case Sensitive
  const caseSensitiveLabel = document.createElement("label");
  caseSensitiveLabel.textContent = "Case Sensitive:";
  const caseSensitiveInput = document.createElement("input");
  caseSensitiveInput.id = "case-sensitive";
  caseSensitiveInput.type = "checkbox";
  caseSensitiveInput.checked = phraseObj.caseSensitive;
  caseSensitiveLabel.appendChild(caseSensitiveInput);
  caseSensitiveLabel.appendChild(document.createElement("br"));

  // Replace With Dropdown
  const replaceWithLabel = document.createElement("label");
  replaceWithLabel.textContent = "Replace With:";
  const replaceWithDropdown = document.createElement("select");
  replaceWithDropdown.id = "replace-with";
  replaceWithDropdown.name = "replace-with";
  const replaceWithRedactOption = document.createElement("option");
  replaceWithRedactOption.value = "redact";
  replaceWithRedactOption.textContent = "Redact";
  const replaceWithCustomOption = document.createElement("option");
  replaceWithCustomOption.value = "custom";
  replaceWithCustomOption.textContent = "Custom";
  replaceWithDropdown.appendChild(replaceWithRedactOption);
  replaceWithDropdown.appendChild(replaceWithCustomOption);
  replaceWithDropdown.value = phraseObj.replaceWith;
  replaceWithDropdown.addEventListener("change", function () {
    if (replaceWithDropdown.value === "custom") {
      replacementPhraseLabel.style.display = "block";
      smartCasingLabel.style.display = "block";
    } else {
      replacementPhraseLabel.style.display = "none";
      smartCasingLabel.style.display = "none";
    }
  });
  replaceWithLabel.appendChild(replaceWithDropdown);
  replaceWithLabel.appendChild(document.createElement("br"));

  // Replacement Phrase
  const replacementPhraseLabel = document.createElement("label");
  replacementPhraseLabel.textContent = "Replacement Phrase:";
  const replacementPhraseInput = document.createElement("input");
  replacementPhraseInput.id = "replacement-phrase";
  replacementPhraseInput.type = "text";
  replacementPhraseInput.value = phraseObj.replacement
    ? phraseObj.replacement
    : "";
  if (phraseObj.replaceWith !== "custom") {
    replacementPhraseLabel.style.display = "none";
  }
  replacementPhraseLabel.appendChild(replacementPhraseInput);
  replacementPhraseLabel.appendChild(document.createElement("br"));

  // Smart Casing
  const smartCasingLabel = document.createElement("label");
  smartCasingLabel.textContent = "Smart Casing:";
  const smartCasingInput = document.createElement("input");
  smartCasingInput.id = "smart-casing";
  smartCasingInput.type = "checkbox";
  smartCasingInput.checked = phraseObj.smartCase;
  if (phraseObj.replaceWith !== "custom") {
    smartCasingLabel.style.display = "none";
  }
  smartCasingLabel.appendChild(smartCasingInput);
  smartCasingLabel.appendChild(document.createElement("br"));

  // Replace Option
  const replaceOptionLabel = document.createElement("label");
  replaceOptionLabel.textContent = "Replace Option:";
  const replaceOptionDropdown = document.createElement("select");
  replaceOptionDropdown.id = "replace-option";
  replaceOptionDropdown.name = "replace-option";
  const replaceBlockPhraseOnlyOption = document.createElement("option");
  replaceBlockPhraseOnlyOption.value = "block-phrase-only";
  replaceBlockPhraseOnlyOption.textContent = "Eliminate Block Phrase";
  const replaceEntireSentenceOption = document.createElement("option");
  replaceEntireSentenceOption.value = "context";
  replaceEntireSentenceOption.textContent = "Destroy Context";
  const replaceEntirePageOption = document.createElement("option");
  replaceEntirePageOption.value = "page";
  replaceEntirePageOption.textContent = "Obliterate Entire Page";
  replaceOptionDropdown.appendChild(replaceBlockPhraseOnlyOption);
  replaceOptionDropdown.appendChild(replaceEntireSentenceOption);
  replaceOptionDropdown.appendChild(replaceEntirePageOption);
  replaceOptionDropdown.value = phraseObj.replaceOption;
  replaceOptionLabel.appendChild(replaceOptionDropdown);
  replaceOptionLabel.appendChild(document.createElement("br"));


  // Confirm
  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.type = "button";
  confirmButton.addEventListener("click", function () {
    saveModifiedPhrase(phraseObj, replacees);
  });

  // Cancel
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.type = "button";
  cancelButton.addEventListener("click", function () {
    clearModifyDropdown();
  });

  modifyForm.appendChild(blockPhraseLabel);
  modifyForm.appendChild(caseSensitiveLabel);
  modifyForm.appendChild(replaceWithLabel);
  modifyForm.appendChild(replacementPhraseLabel);
  modifyForm.appendChild(smartCasingLabel);
  modifyForm.appendChild(replaceOptionLabel);
  modifyForm.appendChild(confirmButton);
  modifyForm.appendChild(cancelButton);

  modifyDropdown.appendChild(modifyForm);
  parentElement.parentNode.insertBefore(
    modifyDropdown,
    parentElement.nextSibling
  );
}

// Retrieve the phrase elements from the form and replace
// the phrase object in the phrase array with the new one
function saveModifiedPhrase(phraseObj, replacees) {
  const modifiedBlockPhraseInput = document.querySelector(
    "#modify-dropdown input[id='block-phrase']"
  );
  const modifiedCaseSensitiveInput = document.querySelector(
    "#modify-dropdown input[id='case-sensitive']"
  );
  const modifiedReplaceWithDropdown = document.querySelector(
    "#modify-dropdown select[id='replace-with']"
  );
  const modifiedReplacementPhraseInput = document.querySelector(
    "#modify-dropdown input[id='replacement-phrase']"
  );
  const modifiedSmartCasingInput = document.querySelector(
    "#modify-dropdown input[id='smart-casing']"
  );
  const modifiedReplaceOptionDropdown = document.querySelector(
    "#modify-dropdown select[id='replace-option']"
  );

  phraseObj.target = modifiedBlockPhraseInput.value;
  phraseObj.caseSensitive = modifiedCaseSensitiveInput.checked;
  phraseObj.replaceWith = modifiedReplaceWithDropdown.value;
  phraseObj.replacement = modifiedReplacementPhraseInput.value || undefined;
  phraseObj.smartCase = modifiedSmartCasingInput.checked;
  phraseObj.replaceOption = modifiedReplaceOptionDropdown.value;

  console.log("newPhraseObj:", phraseObj);

  browser.storage.local
    .set({ replacees })
    .then(() => {
      showPhraseList();
    })
    .catch((error) => {
      console.error("Error while updating storage:", error);
    });

  clearModifyDropdown();
}

// Remove the modify dropdown from the DOM
function clearModifyDropdown() {
  if (modifyingPhraseObj && modifyingPhraseParent) {
    const modifyDropdown = document.getElementById("modify-dropdown");
    const parentElement = modifyingPhraseParent;
    modifyingPhraseParent = null;
    modifyingPhraseObj = null;

    if (parentElement.parentNode) {
      parentElement.parentNode.removeChild(modifyDropdown);
    }
  }
}

// Delete the phrase object from the replacees and
// refresh the phrase list
function deletePhrase(phraseObj, replacees) {
  const updatedReplacees = replacees.filter(
    (item) => item.target !== phraseObj.target
  );

  browser.storage.local
    .set({ replacees: updatedReplacees })
    .then(() => {
      showPhraseList();
    })
    .catch((error) => {
      console.error("Error while updating storage:", error);
    });
}
