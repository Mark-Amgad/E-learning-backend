import gtts from "node-gtts";
import path from "path";
import fs from "fs";
import SentenceModel from "../models/Sentence";
import GeneratedListeningQuestionModel from "../models/GeneratedListeningQuestion";
var g = gtts("en");


export async function GetAudio(req, res) {
  let level = req.params.level;
  console.log({ level: level });
  let sentences = await SentenceModel.find({ level: level });
  let sentence = sentences[Math.floor(Math.random() * sentences.length)];
  console.log(sentence);
  let text = sentence.text;
  console.log(text);
  var filepath = path.join(__dirname + "/../audio/audio.mp3");
  console.log(filepath);
  g.save(filepath, text, async function () {
  });

  filepath = path.join(__dirname + "/../audio", text + '.mp3');
  console.log(filepath);
  g.save(filepath, text, async function () {
    let object = new GeneratedListeningQuestionModel({
      path: "src/audio/" + text + '.mp3',
      level: level,
      answer: text
    });
    await object.save();
    console.log(text);
    res.send(JSON.stringify({ text: text }))
    // var readStream = fs.createReadStream(filepath);
    // readStream.pipe(res);
  });

}

export function audio(req, res) {
  setTimeout(() => {
    var filepath = path.join(__dirname + "/../audio/audio.mp3");
    var readStream = fs.createReadStream(filepath);
    readStream.pipe(res);

  }, 500)
}
