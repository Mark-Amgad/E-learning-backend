import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
const port = 4040;
const app = express();

app.listen(port, async () => {
    try {
        await mongoose.connect("mongodb+srv://mark:1234@gp22.qj7riro.mongodb.net/?retryWrites=true&w=majority");
        console.log("The server is running on port " + port);
        console.log("Database was connected successfully");
        //console.log(process.env.PORT);
    }
    catch (err) {
        console.log("There is a problem in the database or in the server");
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



import Router from "./routes/Routes";

app.use("/", Router);

//import {transfer} from "./controllers/mongoScripts";
//app.get("/transfer",transfer);