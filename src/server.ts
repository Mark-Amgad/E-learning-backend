import express from "express";
import mongoose from "mongoose";

const port = 4040;
const app = express();

app.listen(port,async ()=>{
    try
    {
        await mongoose.connect("mongodb+srv://mark:1234@gp22.qj7riro.mongodb.net/?retryWrites=true&w=majority");
        console.log("The server is running on port " + port);
        console.log("Database was connected successfully");
        //console.log(process.env.PORT);
    }
    catch(err)
    {
        console.log("There is a problem in the database or in the server");
    }
});


import McqCompQuestionController from "./controllers/McqCompQuestionController";
McqCompQuestionController(app);