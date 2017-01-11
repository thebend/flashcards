var availableCharacters = [];
var letterDetails = {};
var buttons = [];
var character;
var pronounciation;
var examples;
var help;

function calculateDictionary(characterCategories) {
    availableCharacters = [];
    Object.keys(hindi)
        .filter( function(group) { return characterCategories.indexOf(group) > -1; })
        .forEach(function(group) {
            group = hindi[group];
            Object.keys(group).forEach(function(letter) {
                availableCharacters.push(letter);
            });
        });
}

function toggleCategoryButton(event) {
    var button = event.target;
    button.className = (button.className == 'disabled' ? '' : 'disabled');
    buildCategories();
}

function buildCategories() {
    var characterCategories = buttons
        .filter(function(button) { return button.className == ''; })
        .map(function(button) {    return button.innerText.toLowerCase(); });

    calculateDictionary(characterCategories);
}

function init() {
    // create references to relevant page elements
    character = document.getElementById('character');
    pronounciation = document.getElementById('pronounciation');
    examples = document.getElementById('examples');
    help = document.getElementById('help');

    // enable character category buttons
    var controls = document.getElementById('character-group-controls');

    Object.keys(hindi).sort().forEach(function(groupName) {
        var group = hindi[groupName];

        // make category toggle button
        var b = document.createElement('button');
        b.innerText = groupName.charAt(0).toUpperCase() + groupName.substring(1);
        b.onclick = toggleCategoryButton;
        controls.appendChild(b);
        buttons.push(b);

        // build flat dictionary of symbols from group hierachy structure
        Object.keys(group).forEach(function(letter) {
            letterDetails[letter] = group[letter];
        });
    });

    buildCategories();
    loadCharacter();
    window.onhashchange = loadCharacter;
}

function loadCharacter() {
    var requestedCharacter = document.URL.match(/#(.+)$/);
    if (requestedCharacter) {
        var letter = requestedCharacter[1]
        loadCard(letter);
    } else {
        newCard();
    }
}

function next() {
    if (help.style.display == 'none') getHelp();
    else newCard();
}

function newCard() {
    var i = Math.round(Math.random() * (availableCharacters.length - 1));
    var letter = availableCharacters[i];
    if (letter == character.innerText) {
        newCard();
        return;
    }
    loadCard(letter);
}

function loadCard(letter) {
    document.location.href = document.URL.replace(/#.+$/,'') + '#'+letter;
    var details = letterDetails[letter];
    character.innerText = letter;

    help.style.display = 'none';
    pronounciation.innerText = details.pronounciation;
    examples.innerHTML = details.examples.join(', ');
}

function getHelp() {
    help.style.display = '';
}