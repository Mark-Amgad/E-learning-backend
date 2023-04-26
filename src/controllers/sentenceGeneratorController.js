const request = require("request");
const cheerio = require('cheerio');
import { spawn } from "child_process";
import path from "path";


export async function getSentence(req, res) {
  const URL_TO_PARSE = "https://randomword.com/sentence";
  let sentence = "";
  let text;
  request(URL_TO_PARSE, (err, response, body) => {
    if (err) throw new Error("Something went wrong");
    // Load the HTML into cheerio's DOM
    const $ = cheerio.load(body);
    // Print the text nodes of the <table> in the HTML
    sentence = $('#random_word').text();
    console.log(path.resolve('python/sentenceClassifier.py'));
    const python = spawn('python', [path.resolve('python/sentenceClassifier.py'), sentence]);

    python.stdout.on('data', function (data) {
      text = data.toString();
      res.send(text + " " + sentence);
    });

    python.on('close', (data) => {
      console.log(data.toString());
      console.log("script closed...");
    });
  });



}
