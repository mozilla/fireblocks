function getPhraseObj() {
  let replacement;
  const target = document.getElementById("block-phrase").value;
  const caseSensitive = document.getElementById("case-sensitive").checked;
  const replaceWith = document.getElementById("replace-with").value;
  if (replaceWith === "custom") {
    replacement = document.getElementById("replacement-phrase").value;
  }
  const smartCase = document.getElementById("smart-casing").checked;
  const replaceOption = document.getElementById("replace-option").value;

  return {
    target: target,
    caseSensitive: caseSensitive,
    replaceWith: replaceWith,
    replacement: replacement,
    smartCase: smartCase,
    replaceOption: replaceOption
  };
}

// Get the phrase data from the form, store it, and clear the form
function storePhraseOnSubmit() {
  const phraseObj = getPhraseObj();
  
  browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
    replacees.push(phraseObj);
    browser.storage.local.set({ replacees });
    console.log("stored", phraseObj);

    document.getElementById("block-phrase").value = "";
    document.getElementById("replacement-phrase").value = "";
    document.getElementById("replacement-phrase-container").style.display =
      "none";
    document.getElementById("case-sensitive").checked = false;
    document.getElementById("smart-casing").checked = false;
    document.getElementById("replace-option").value = "block-phrase-only";
    document.getElementById("replace-with").value = "redact";
  });
}

window.addEventListener("DOMContentLoaded", function () {
  // Show or hide the tabs
  document
    .getElementById("addPhraseTab")
    .addEventListener("click", function () {
      document.getElementById("addPhraseTabContent").style.display = "block";
      document.getElementById("viewPhraseTabContent").style.display = "none";
    });
  document
    .getElementById("viewPhraseTab")
    .addEventListener("click", function () {
      document.getElementById("addPhraseTabContent").style.display = "none";
      showPhraseList();
      document.getElementById("viewPhraseTabContent").style.display = "block";
    });

  // Show or hide the custom replacement phrase
  document
    .getElementById("replace-with")
    .addEventListener("change", function () {
      if (this.value === "custom") {
        document.getElementById("replacement-phrase-container").style.display =
          "block";
      } else {
        document.getElementById("replacement-phrase-container").style.display =
          "none";
      }
    });

  // Store the phrase on submit
  document
    .getElementById("addPhraseForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      storePhraseOnSubmit();
    });
});
