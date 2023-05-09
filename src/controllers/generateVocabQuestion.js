// Import the required modules
import SentenceModel from "../models/Sentence"; // Import the SentenceModel
import QuestionModel from "../models/Question"; // Import the Question model
const axios = require("axios"); // Import the axios library

// Define an async function to generate a vocabulary question
export async function generateVocabQuestion(req, res, next) {
    try {
        // Get the level from the request parameters
        const level = req.params.level;
        // console.log(req.params.level)

        // Find a sentence with the given level
        const sentence = await SentenceModel.find({ "level": level });

        // If no sentence is found, return a 404 error
        if (!sentence) {
            return res.status(404).json({ message: "Sentence not found" });
        }

        // Set up the API request options
        const options = {
            method: "POST",
            url: "http://164.92.176.13/fillBlank",
            data: {
                sentence: sentence[0].text,
            },
        };

        // Send the API request and get the response
        const response = await axios.request(options);

        // Extract the question, multiple-choice options, and answer from the response data
        const { question, mcq, answer } = response.data;

        // Create a new vocabulary question object
        const vocabQuestion = new QuestionModel({
            question,
            choices: mcq,
            answer,
            type: "MCQ",
            category: "Vocabulary",
            level,
            url: "",
        });

        // Save the vocabulary question to the database
        await vocabQuestion.save();

        // Send a success response
        res.json({ message: "Question generated successfully" });
    } catch (error) {
        // If an error occurs, log it and pass it to the next error handling middleware
        console.error(error);
        next(error);
    }
}
