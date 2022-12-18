// var gtts = require('node-gtts')('en');
// var path = require('path');
import gtts from "node-gtts";
import path from "path";
import express from "express";
var g = gtts("en");
var filepath = path.join(__dirname+"/../audio", 'i-love-you.mp3');


export function GetAudio(req,res){
  g.save(filepath, req.params.text, function() {
    console.log(req.params.text+' save done');
    res.sendFile(path.resolve('audio/i-love-you.mp3'), "/src/audio/i-love-you.mp3", function (err) {
      if (err) {
          console.log(err);
      } else {
          console.log('Sent:', filepath);
      }
  });
  }); 
} 