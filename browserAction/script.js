addPhraseTab = document.getElementById('addPhraseTab');
viewPhraseTab = document.getElementById('viewPhraseTab');
addPhraseTabContent = document.getElementById('addPhraseTabContent');
viewPhraseTabContent = document.getElementById('viewPhraseTabContent');


document.getElementById('addPhraseTab').addEventListener('click', function() {
    addPhraseTabContent.style.display = 'block';
    viewPhraseTabContent.style.display = 'none';
  });
  
  document.getElementById('viewPhraseTab').addEventListener('click', function() {
    addPhraseTabContent.style.display = 'none';
    viewPhraseTabContent.style.display = 'block';
  });