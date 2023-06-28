// Get the phrase data from the form, store it, and clear the form
function storePhraseOnSubmit() {
  let replacement, repeat;
  const target = document.getElementById("block-phrase").value;
  const caseSensitive = document.getElementById("case-sensitive").checked;
  const replaceWith = document.getElementById("replace-with").value;
  if (replaceWith === "custom") {
    replacement = document.getElementById("replacement-phrase").value;
  }
  const smartCase = document.getElementById("smart-casing").checked;
  const replaceOption = document.getElementById("replace-option").value;
  if (
    replaceOption === "sentence" ||
    replaceOption === "paragraph" ||
    replaceOption === "page"
  ) {
    repeat = document.getElementById("repeat-by").value;
  }

  const phraseObj = {
    target: target,
    caseSensitive: caseSensitive,
    replaceWith: replaceWith,
    replacement: replacement,
    smartCase: smartCase,
    replaceOption: replaceOption,
    repeat: repeat,
  };

  browser.storage.local.get("replacees").then((result) => {
    const replacees = result.replacees || [];
    replacees.push(phraseObj);
    browser.storage.local.set({ replacees });
    console.log("stored", phraseObj);

    document.getElementById("block-phrase").value = "";
    document.getElementById("replacement-phrase").value = "";
    document.getElementById("replacement-phrase-container").style.display = "none";
    document.getElementById("case-sensitive").checked = false;
    document.getElementById("smart-casing").checked = false;
    document.getElementById("replace-option").value = "block-phrase-only";
    document.getElementById("replace-with").value = "blur";
    document.getElementById("repeat-by").value = "word";
    document.getElementById("repeat-container").style.display = "none";
  });
}


// Show or hide the tabs
addPhraseTab = document.getElementById("addPhraseTab");
viewPhraseTab = document.getElementById("viewPhraseTab");
addPhraseTabContent = document.getElementById("addPhraseTabContent");
viewPhraseTabContent = document.getElementById("viewPhraseTabContent");
blockPhraseList = document.getElementById("blockPhraseList");

document.getElementById("addPhraseTab").addEventListener("click", function () {
  addPhraseTabContent.style.display = "block";
  viewPhraseTabContent.style.display = "none";
});
document.getElementById("viewPhraseTab").addEventListener("click", function () {
  addPhraseTabContent.style.display = "none";
  showPhraseList();
  viewPhraseTabContent.style.display = "block";
});

// Show or hide the repeat option
document
  .getElementById("replace-option")
  .addEventListener("change", function () {
    if (
      this.value === "sentence" ||
      this.value === "paragraph" ||
      this.value === "page"
    ) {
      document.getElementById("repeat-container").style.display = "block";
    } else {
      document.getElementById("repeat-container").style.display = "none";
    }
  });

// Show or hide the custom replacement phrase
document.getElementById("replace-with").addEventListener("change", function () {
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
