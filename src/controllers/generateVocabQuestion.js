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
        let sentence = await SentenceModel.find({ "level": level });
        sentence = sentence[getRandomIndex(sentence)]
        // If no sentence is found, return a 404 error
        if (!sentence) {
            return res.status(404).json({ message: "Sentence not found" });
        }

        // Set up the API request options
        const options = {
            method: "POST",
            url: "http://164.92.204.79/fillBlank",
            data: {
                sentence: sentence.text,
            },
        };

        // Send the API request and get the response
        const response = await axios.request(options);

        // Extract the question, multiple-choice options, and answer from the response data
        let { question, mcq, answer } = response.data;
        question = replaceWordWithDots(question, answer);
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

function replaceWordWithDots(str, word) {
    // Create a regular expression pattern with word boundaries
    var pattern = new RegExp('\\b' + word + '\\b', 'gi');

    // Replace the word with dots
    var replacedString = str.replace(pattern, ' ....... ');

    return replacedString;
}

export async function generateVocabQuestionForDemo(req, res, next) {
    try {
        // Get the level from the request parameters
        const level = req.body.level;
        const sentence = req.body.sentence;
        // console.log(req.params.level)

        if (!sentence) {
            return res.status(404).json({ message: "Sentence not found" });
        }

        // Set up the API request options
        const options = {
            method: "POST",
            url: "http://164.92.204.79/fillBlank",
            data: {
                sentence: sentence,
            },
        };

        // Send the API request and get the response
        const response = await axios.request(options);
        response.data.question = replaceWordWithDots(response.data.question, response.data.answer);
        // Send a success response
        res.json([response.data]);
    } catch (error) {
        // If an error occurs, log it and pass it to the next error handling middleware
        console.error(error);
        next(error);
    }
}

function getRandomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
}
