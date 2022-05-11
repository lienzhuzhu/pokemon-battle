// javascript for pokemon game functionality
//


const NUMBER_OF_OPTIONS = 20;
const NUMBER_OF_MOVES = 4;


/* ******************************* */
/* Helper Methods For Overall Game */
/* ******************************* */

function buildApiUrl(selectionBox) {
  let baseUrl = 'https://pokeapi.co/api/v2/pokemon/';  
  let nameOfChosenPokemon = selectionBox.value;
  let finishedUrl = baseUrl + nameOfChosenPokemon;
  return finishedUrl;
}

function getFrontSpriteUrl(pokemonObj) {
  return pokemonObj.sprites.front_default;
}

function getBackSprite(pokemonObj) {
  return pokemonObj.sprites.back_default;
}

function loadSprite(imgTag, spriteUrl) {
  imgTag.setAttribute("src", spriteUrl);
}

/*
// not used
//
function buildApiUrlFromString(str) {
  let baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  let nameOfChosenPokemon = str; 
  let finishedUrl = baseUrl + nameOfChosenPokemon;
  return finishedUrl;
}

function spriteExists(pokemonUrl) {
  // let spriteCheckRequest = new XMLHttpRequest();
  // spriteCheckRequest.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     let pokemonObj= JSON.parse((this.responseText));
  //     return (pokemonObj.sprites.front_default != null);
  //   }
  // }
  // spriteCheckRequest.open("GET", pokemonUrl, true);
  // spriteCheckRequest.send();
  return true;
}

function loadPokemon() {
  let optionsRequest = new XMLHttpRequest();

  optionsRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      // console.log("onreadystatechange called");
      let pokemonList = JSON.parse(this.responseText);
      let alreadyPicked = [];
  
      for (let i = 0; i < NUMBER_OF_OPTIONS; i++) {        // pick 20 pokemon
        let pickedOne = false;

        while (!pickedOne) {                // while a pokemon has NOT been added to options
          let index = Math.floor(0 + Math.random() * 1126);
          let chosenName = pokemonList.results[index].name;
          let potentialPokemon = buildApiUrlFromString(chosenName);
  
          if ( !alreadyPicked.includes(chosenName) && spriteExists(potentialPokemon) ) {    // if the pokemon has not already been drawn

            pickedOne = true;
            alreadyPicked[i] = chosenName;
            
            let optionTagOne = document.createElement("option");
            let optionTagTwo = document.createElement("option");

            selectOne.appendChild(optionTagOne);
            selectTwo.appendChild(optionTagTwo);

            optionTagOne.value = chosenName;
            optionTagTwo.value = chosenName;

            optionTagOne.id = "select-one-option-"+i;
            optionTagTwo.id = "select-two-option-"+i;

            optionTagOne.className = "option-class-one";
            optionTagTwo.className = "option-class-two";

            optionTagOne.text = chosenName;
            optionTagTwo.text = chosenName;

          }
        }
      }
    }
  }
  optionsRequest.open("GET", "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0", true);
  optionsRequest.send();
}
//
*/




/* *************** */
/* setting globals */
/* *************** */
let selectOne = document.getElementById("player-one-pokemon-select");
let selectTwo = document.getElementById("player-two-pokemon-select");

let previewSpriteOne = document.getElementById("sprite-preview-one");
let previewSpriteTwo = document.getElementById("sprite-preview-two");

let playSpriteOne = document.getElementById("player-one-sprite");
let playSpriteTwo = document.getElementById("player-two-sprite");

let playerOneLoaded = false;
let playerTwoLoaded = false;
let loaded = false;

let nameTagOne = document.getElementById("player-one-name");
let nameTagTwo = document.getElementById("player-two-name");

let hpTagOne = document.getElementById("player-one-health-stat");
let hpTagTwo = document.getElementById("player-two-health-stat");

let healthBarOne = document.getElementById("player-one-health-bar");
let healthBarTwo = document.getElementById("player-two-health-bar");

let pokemonUrlOne = buildApiUrl(selectOne);
let pokemonUrlTwo = buildApiUrl(selectTwo);



/* *********************************** */
/* objects with game time pokemon data */
/* *********************************** */
let PokemonOne = {
  name: "",
  baseHp: "",
  remainingHp: "",
  moves: [
    { name: null, power: null },
    { name: null, power: null },
    { name: null, power: null },
    { name: null, power: null }
  ],
  nameDisplay: nameTagOne,
  hpDisplay: hpTagOne,
  healthBar: healthBarOne,
}

let PokemonTwo = {
  name: "",
  baseHp: null,
  remainingHp: null,
  moves: [
    { name: null, power: null },
    { name: null, power: null },
    { name: null, power: null },
    { name: null, power: null }
  ],
  nameDisplay: nameTagTwo,
  hpDisplay: hpTagTwo,
  healthBar: healthBarTwo,
}



/* *************************** */
/* character selection preview */
/* *************************** */
let previewRequestOne = new XMLHttpRequest();
let previewRequestTwo = new XMLHttpRequest();

previewRequestOne.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let pokemon = JSON.parse(this.responseText);
    loadSprite( previewSpriteOne, getFrontSpriteUrl(pokemon) );
  }
};

previewRequestTwo.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let pokemon = JSON.parse(this.responseText);
    loadSprite( previewSpriteTwo, getFrontSpriteUrl(pokemon) );
  }
};


// SET SPRITES BASED ON INITIAL VALUE OF SELECTION BOX
//
previewRequestOne.open("GET", pokemonUrlOne, true);
previewRequestOne.send();

previewRequestTwo.open("GET", pokemonUrlTwo, true);
previewRequestTwo.send();


// SET SPRITES ON CHOSEN VALUE OF SELECTION BOX
// update pokemon urls to what was selected
// update sprites based on selection change
//
selectOne.addEventListener("change", function() {
  pokemonUrlOne = buildApiUrl(selectOne);
  previewRequestOne.open("GET", pokemonUrlOne, true);
  previewRequestOne.send();
});

selectTwo.addEventListener("change", function() {
  pokemonUrlTwo = buildApiUrl(selectTwo);
  previewRequestTwo.open("GET", pokemonUrlTwo, true);
  previewRequestTwo.send();
})




/* ********************************* */
/* helper methods for game play data */
/* ********************************* */

function setName(pokemonResponse, pokemonObj) { 
  pokemonObj.name = pokemonResponse.name;
  pokemonObj.nameDisplay.innerHTML = pokemonObj.name;
}

function setHp(pokemonResponse, pokemonObj) {
  pokemonObj.baseHp = pokemonResponse.stats[0].base_stat;
  pokemonObj.remainingHp = pokemonObj.baseHp;
}

function updateHp(pokemonObj) { 
  if (pokemonObj.remainingHp < 0) {
    pokemonObj.remainingHp = 0;
  } 
  pokemonObj.hpDisplay.innerHTML = pokemonObj.remainingHp + " / " + pokemonObj.baseHp;
  let remainingPercent = Math.floor( 100 * pokemonObj.remainingHp / pokemonObj.baseHp);
  pokemonObj.healthBar.style.width = remainingPercent + "%";
}

function decreaseHp(pokemon, damage) {
  let factor = Math.random() * (0.20 - 0.05) + 0.05;
  console.log(factor);
  pokemon.remainingHp = Math.floor( pokemon.remainingHp - (damage * factor) );
}


// give each pokemon object their moves
//
function setPokemonOneMoves(responseData) {

  for (let i = 0; i < NUMBER_OF_MOVES; i++) {

    let retrievedMove = responseData.moves[i].move;
    PokemonOne.moves[i].name = retrievedMove.name;
    let moveUrl = retrievedMove.url;

    let powerRequest = new XMLHttpRequest();
    powerRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let moveData = JSON.parse(this.responseText);

        if (moveData.power == null) {
          moveData.power = 50;
        }

        PokemonOne.moves[i].power = moveData.power;
      }
    }

    powerRequest.open("GET", moveUrl, true);
    powerRequest.send();
  }
}

function setPokemonTwoMoves(responseData) {

  for (let i = 0; i < NUMBER_OF_MOVES; i++) {

    let retrievedMove = responseData.moves[i].move;
    PokemonTwo.moves[i].name = retrievedMove.name;
    let moveUrl = retrievedMove.url;

    let powerRequest = new XMLHttpRequest();
    powerRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let moveData = JSON.parse(this.responseText);

        if (moveData.power == null) {
          moveData.power = 50;
        }

        PokemonTwo.moves[i].power = moveData.power;
      }
    }

    powerRequest.open("GET", moveUrl, true);
    powerRequest.send();
  }
}


// two methods are necessary for loading move buttons
// with correct data because of AJAX async nature
//
function loadMoveNamesIntoButtons(pokemon, playerNumber) {
  for (let i = 0; i < NUMBER_OF_MOVES; i++) {
    let num = i + 1;
    let currButton = document.getElementById("p-" + playerNumber + "-move-" + num);
    currButton.innerText = pokemon.moves[i].name;
  }
}

function loadMovePowerIntoButtons(pokemon, playerNumber) {
  for (let i = 0; i < NUMBER_OF_MOVES; i++) {
    let num = i + 1;
    let currButton = document.getElementById("p-" + playerNumber + "-move-" + num);
    currButton.value = pokemon.moves[i].power;
    currButton.addEventListener("click", attack);
  }
}






/* ********************** */
/* Loading game play data */
/* ********************** */
let playerOneRequest = new XMLHttpRequest();
let playerTwoRequest = new XMLHttpRequest();

playerOneRequest.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let pokemon = JSON.parse(this.responseText);
    loadSprite( playSpriteOne, getBackSprite(pokemon) );
    setName(pokemon, PokemonOne);
    setHp(pokemon, PokemonOne);
    updateHp(PokemonOne);
    setPokemonOneMoves(pokemon);
    loadMoveNamesIntoButtons(PokemonOne, 1);
  }
};

playerTwoRequest.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let pokemon = JSON.parse(this.responseText);
    loadSprite( playSpriteTwo, getFrontSpriteUrl(pokemon) );
    setName(pokemon, PokemonTwo);
    setHp(pokemon, PokemonTwo);
    updateHp(PokemonTwo);
    setPokemonTwoMoves(pokemon);
    loadMoveNamesIntoButtons(PokemonTwo, 2);
  }
};


// play button click event sends AJAX calls and
// changes game screen and changes favicon
// sets chosen pokemon data
//
let initScreen = document.getElementById("initial-screen");
let gameScreen = document.getElementById("game-page");
let playButton = document.getElementById("play-button");

playButton.addEventListener("click", function() {
  initScreen.style.display = "none";
  gameScreen.style.display = "grid";
  document.getElementById("favicon-id").setAttribute("href", "./open-pokeball.png");  // change favicon

  playerOneRequest.open("GET", pokemonUrlOne, true);
  playerTwoRequest.open("GET", pokemonUrlTwo, true);

  playerOneRequest.send();
  playerTwoRequest.send();
});




/* ********* */
/* Game Loop */
/* ********* */

let movesMade = 0;

let promptConsole = document.getElementById("console");

function setConsoleText(str) {
  promptConsole.innerHTML = str;
}

function getAttackingPlayer() {
  let player = "";
  if (movesMade % 2 == 0) {
    player = "One";
  } else {
    player = "Two";
  }
  return player;
}


function prompt(input) {
  let str = input + "What will Trainer " + getAttackingPlayer() + " do?";
  setConsoleText(str);
}

function attack() {
  // only allow this stuff to happen if it is the player's turn
  //
  let attackingPlayer = getAttackingPlayer();
  let attackingPokemon;
  if (attackingPlayer == "One") {
    attackingPokemon = PokemonOne.name;
  } else {
    attackingPokemon = PokemonTwo.name;
  }
  

  if (this.getAttribute("data-player") == attackingPlayer) {
    let dmg = this.value;

    let moveName = this.innerHTML;
    let moveInfo = attackingPokemon + " used " + moveName + ".\n";

    let defending;
    
    if (getAttackingPlayer() == "One") {
      defending = PokemonTwo;
    } else {
      defending = PokemonOne;
    }
  
    decreaseHp(defending, dmg);
    updateHp(defending);

    movesMade++;
    if ( !won() ) {
      prompt(moveInfo);
    }
    else {
      setConsoleText("Trainer " + attackingPlayer + " wins!");
      document.getElementById("player-one-moves").style.display = "none";
      document.getElementById("player-two-moves").style.display = "none";
    }
  }
}

function won() {
  return (PokemonOne.remainingHp <= 0 || PokemonTwo.remainingHp <= 0)
}

// start button necessary to make sure everything loads correctly 
// before accessing data due to AJAX async nature
//
let startButtonWrapper = document.getElementById("start-button-wrapper");
let startButton = document.getElementById("start-button");
startButton.addEventListener("click", function() {
  startButtonWrapper.style.display = "none";
  loadMovePowerIntoButtons(PokemonOne, 1);
  loadMovePowerIntoButtons(PokemonTwo, 2);
  prompt("");
})

// quit button refreshes page 
//
document.getElementById("quit-button").addEventListener("click", function() {
  location.reload(true);
})







