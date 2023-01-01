const axios = require("axios");

export function checkForErrors(req, res) {
  // console.log(req);
  const language = req.body.language;
  const text = req.body.text;

  const encodedParams = new URLSearchParams();
  encodedParams.append("language", language);          // what is the language of the text
  encodedParams.append("text", text);  // text that we want to check

  const options = {
    method: 'POST',
    url: 'https://api.languagetoolplus.com/v2/check',
    data: encodedParams
  };

  axios.request(options).then(function (response) {
    // console.log(response.data);
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });
}

export function getSupportedLanguages(req, res) {
  const options = {
    method: 'GET',
    url: 'https://api.languagetoolplus.com/v2/languages',
  };

  axios.request(options).then(function (response) {
    // console.log(response.data);
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });
}

export function generateWrongSentence(req, res) {
  // only for test
  const options = {
    method: 'GET',
    url: 'https://randomwordgenerator.com/json/sentences.json',
    headers: { "Accept-Encoding": "gzip,deflate,compress" }
  };

  let sentence = "";
  axios.request(options).then(function (response) {
    // console.log(response.data);
    let arr = response.data.data;
    let randNumber = Math.floor(Math.random() * arr.length)
    sentence = arr[randNumber].sentence;
    let incorrectSentence = makeSentenceIncorrect(sentence);
    res.json(incorrectSentence);


  }).catch(function (error) {
    console.error(error);
  });
}


/**************************************helper functions*****************************/


function makeSentenceIncorrect(sentence) {
  let words = sentence.split(' ');
  // [correct, incorrect]
  let verbs = [["am", "is"], ["is", "are"], ["are", "is"], ["this", "these"], ["that", "those"], ["those", "this"], ["these", "that"], ["an", "a"], ["a", "an"], ["many", "much"], ["much", "many"], ["were", "was"], ["was", "were"], ["has", "have"], ["have", "has"], ["had", "has"], ["be", "is"], ["of", "off"], ["off", "of"], ["too", "to"], ["two", "to"], ["to", "two"], ["so", "many"], ["I", "he"], ["he", "we"], ["she", "they"], ["would", "wood"], ["wood", "would"], ["should", "shod"]];
  for (let i = 0; i < verbs.length; i++) {
    const verb = verbs[i];
    let idx = words.findIndex(word => word.toLowerCase() === verb[0].toLowerCase());
    if (idx != -1) {
      words[idx] = verb[1];
      return { sentence: words.join(" "), wrong: verb[1], answer: verb[0] };
    }
  };


  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

  let originalWord = "", newWord = "";
  do {
    let randNum = Math.floor(Math.random() * words.length);
    originalWord = words[randNum];
    newWord = words[randNum];

    let letter1ToChange = Math.floor(Math.random() * originalWord.length);
    let letter2ToChange = Math.floor(Math.random() * originalWord.length);
    let letter1 = Math.floor(Math.random() * 26);
    let letter2 = Math.floor(Math.random() * 26);

    newWord = newWord.substring(0, letter1ToChange) + letters[letter1] + newWord.substring(letter1ToChange + 1);
    newWord = newWord.substring(0, letter2ToChange) + letters[letter1] + newWord.substring(letter2ToChange + 1);

    words[randNum] = newWord;
  } while (newWord === originalWord);

  return { sentence: words.join(" "), wrong: newWord, answer: originalWord };
}
