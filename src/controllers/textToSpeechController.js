// var gtts = require('node-gtts')('en');
// var path = require('path');
import gtts from "node-gtts";
import path from "path";
import {spawn, spawnSync} from "child_process";
import express from "express";
var g = gtts("en");
var filepath = path.join(__dirname + "/../audio", 'audio.mp3');


export function GetAudio(req, res) {
  req.range(10000000000);
  let text;
  const python = spawn('python', [path.resolve('src/python/sentenceGenerator.py')]);
  

  python.stdout.on('data', function (data)  {

    text = data.toString();
    console.log(text);
    g.save(filepath, text, function () {
      console.log(text + ' save done');
      res.sendFile(path.resolve('src/audio/audio.mp3'), "/src/audio/audio.mp3", function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Sent:', filepath);
        }
      });
    });
  });

  python.on('close', (data) => {
    console.log(data.toString());
    console.log("script closed...");
  });

} 