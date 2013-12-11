// ----------------------------------
// useful constants:
// ----------------------------------
var SCRABBLE_LETTER_BOX = [
  "e","e","e","e","e","e","e","e","e","e","e",
  "a","a","a","a","a","a","a","a","a",
  "i","i","i","i","i","i","i","i","i",
  "o","o","o","o","o","o","o","o",
  "n","n","n","n","n","n",
  "r","r","r","r","r","r",
  "t","t","t","t","t","t",
  "l","l","l","l",
  "s","s","s","s",
  "u","u","u","u",
  "d","d","d","d",
  "g","g","g",
  "b","b",
  "c","c",
  "m","m",
  "p","p",
  "f","f",
  "h","h",
  "v","v",
  "w","w",
  "y","y",
  "k",
  "j",
  "x",
  "q",
  "z"
]

var SCRABBLE_LETTER_VALUE = { 
  a:1,b:3,c:3,
  d:2,e:1,f:4,
  g:2,h:4,i:1,
  j:8,k:5,l:1,
  m:3,n:1,o:1,
  p:3,q:10,r:1,s:1,
  t:1,u:1,v:4,
  w:4,x:8,y:4,z:10
};

var ALPHABET_ARRAY = [
  "a","b","c",
  "d","e","f",
  "g","h","i",
  "j","k","l",
  "m","n","o",
  "p","q","r","s",
  "t","u","v",
  "w","x","y","z"
];


// style one HASH << first iteration

// style two preprocess a tree. 

var ScrabbleGame = function(){
  this._dictionary = {};
  this.letterbox = SCRABBLE_LETTER_BOX.slice(); //make a copy so we can modify it...
  // for maing a real scrabble game:
  // this.numLettersLeft = 100;

};

ScrabbleGame.prototype.loadDictionary = function(dict){
  if(!Array.isArray(dict)){ throw "not a proper dictionary"; }
  for (var i = 0; i < dict.length; i++) {
    this._dictionary[dict[i].toLowerCase()] = true;
  };
};

ScrabbleGame.prototype.isValue = function(word){
  if(this._dictionary[word]){ return true; }
  return false;
}

ScrabbleGame.prototype.generateBag = function(bagSize){
  bagSize = bagSize || 7;
  var letterBag = [];
  for (var i = 0; i < bagSize; i++) {
    letterBag.push(this.getNextLetter())
  };
  return letterBag;
};

ScrabbleGame.prototype.getNextLetter = function(){
  var randIndex = Math.ceil(Math.random()*this.letterbox.length);
  return this.letterbox.splice(randIndex,1);
};

ScrabbleGame.prototype.getPossibleWords = function(charArray){
  var validWords = {};
  var seeker = function(currentWord, leftovers, dict){
    if(dict[currentWord]){ validWords[currentWord] = true; }
    for (var i = 0; i < leftovers.length; i++) {
      seeker(currentWord+leftovers[i],leftovers.slice(0,i).concat(leftovers.slice(i+1,leftovers.length)),dict);
    };
  }

  seeker("", charArray,this._dictionary);
  return Object.keys(validWords);
};


// -----------------
// -- pre processing: building the prefix tree and loading its dictionary.
// -----------------

// window.trie = new PreFixTree();

scrabble = new ScrabbleGame()

$.ajax({
  type: "GET",
  url: "./dict",
  dataType: "text",
  success: function(data){
    dictArray = data.split("\n");
    console.log(dictArray);
    scrabble.loadDictionary(dictArray);    
  },
  error: function(err){
    console.error(err);
  }
});

 

// -----------------
// -- for interacting with the user
// -----------------

$('document').ready(function(){
  $('#genLetters').on('click',function(){
    $('#inputBox').val(scrabble.generateBag().join(''));
  });

  $('#findWords').on('click',function(){
    var chars = $('#inputBox').val();
    var charArray = chars.split('');
    var validWords = scrabble.getPossibleWords(charArray);
    $('#list').html('');
    for (var i = 0; i < validWords.length; i++) {
      $('#list').append('<li>' + validWords[i] + '</li>');
    };
  });


});


