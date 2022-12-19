const express = require("express");
//const Grammarly = require("@grammarly/editor-sdk");
import * as Grammarly from '@grammarly/editor-sdk';
const app = express();

const port = 4040;

app.listen(port,()=>{console.log("server is running on port " + port)});


app.get("/",async(req,res)=>{
    try
    {
        const grammarly = await Grammarly.init("client_2J51J5hsg1DC3WGiQ8SEAg");
        const editor = grammarly.withText("He are so happy");
        console.log(editor);
        res.send("done");
    }
    catch(err)
    {
        console.log(err);
        res.send("error");
    }
});
