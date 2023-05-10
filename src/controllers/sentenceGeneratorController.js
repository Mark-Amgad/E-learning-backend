const request = require("request");
const cheerio = require('cheerio');
import { spawn } from "child_process";
import path from "path";
import SentenceModel from "../models/Sentence";
import { Sentence } from "../models/Sentence";


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
    console.log(path.resolve('src/python/sentenceClassifier.py'));
    const python = spawn('python', [path.resolve('src/python/sentenceClassifier.py'), sentence]);

    python.stdout.on('data', async function (data) {
      text = data.toString();
      let level = text.split("+")[0]
      let tense = JSON.parse(text.split("+")[1])
      let sentenceObject = new SentenceModel({"text":sentence,"level":level,"tenses":tense});
      await sentenceObject.save();
      res.send(text + " " + sentence);
    });

    python.on('close', (data) => {
      console.log(data.toString());
      console.log("script closed...");
    });
  });



}
