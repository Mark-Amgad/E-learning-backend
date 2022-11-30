import express from "express";
import mcqComQuestionRoutes from "./routes/McqCompQuestionRouter";
import MongoDatabase from "./Database/MongoDatabase";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const port = process.env.PORT || 4040;
const app = express();
const database = new MongoDatabase();

// connect to mongo database
database.connect();

app.use(mcqComQuestionRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
