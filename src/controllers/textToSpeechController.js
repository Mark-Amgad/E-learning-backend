import gtts from "node-gtts";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
var g = gtts("en");
var filepath = path.join(__dirname + "/../audio", 'audio.mp3');


export function GetAudio(req, res) {

  let text;
  const python = spawn('python', [path.resolve('src/python/sentenceGenerator.py')]);

  python.stdout.on('data', function (data) {
    text = data.toString();
    fs.writeFile(path.resolve('src/python/test.txt'), text, err => {
      if (err) {
        console.error(err);
      }
    });
    g.save(filepath, text, function () {
      var readStream = fs.createReadStream(filepath);
      readStream.pipe(res);
    });
  });

  python.on('close', (data) => {
    console.log(data.toString());
    console.log("script closed...");
  });

}

export function GetText(req, res) {
  fs.readFile(path.resolve('src/python/test.txt'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send({ 'text': data });
  });
}