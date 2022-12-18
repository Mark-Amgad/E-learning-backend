// var gtts = require('node-gtts')('en');
// var path = require('path');
import gtts from "node-gtts";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
var g = gtts("en");
var filepath = path.join(__dirname + "/../audio", 'audio.mp3');


export function GetAudio(req, res) {
  req.range(99999999999999);
  let text;
  const python = spawn('python', [path.resolve('src/python/sentenceGenerator.py')]);


  python.stdout.on('data', function (data) {

    text = data.toString();
    console.log(text);
    g.save(filepath, text, function () {
      console.log(text + ' save done');

      var readStream = fs.createReadStream(filepath);
      var stat = fs.statSync(filepath);

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
      });
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(res);
    });
  });

  python.on('close', (data) => {
    console.log(data.toString());
    console.log("script closed...");
  });

} 