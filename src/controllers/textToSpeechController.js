import gtts from "node-gtts";
import path from "path";
import fs from "fs";
import SentenceModel from "../models/Sentence";
import GeneratedListeningQuestionModel from "../models/GeneratedListeningQuestion";
var g = gtts("en");


export async function GetAudio(req, res) {
  let level = req.params.level;
  console.log({level:level});
  let sentences = await SentenceModel.find({level:level});
  let sentence = sentences[Math.floor(Math.random()*sentences.length)];
  console.log(sentence);
  let text = sentence.text;
  var filepath = path.join(__dirname + "/../audio", text +'.mp3');
  console.log(text);
  g.save(filepath, text, async function () {
    // var readStream = fs.createReadStream(filepath);
    // readStream.pipe(res);
    let object = new GeneratedListeningQuestionModel({
      path: "src/audio/"  + text +'.mp3',
      level: level,
      answer:text
    });
    await object.save();
    res.send("Question Generated Successfuly")
  });


}
