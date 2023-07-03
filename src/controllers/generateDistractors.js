// Import the required modules
const axios = require("axios"); // Import the axios library

// Define an async function to generate a vocabulary question
export async function generateDistractors(req, res, next) {
    try {
        // Get the level from the request parameters
        const word = req.body.word;
        const n = req.body.n;
        // console.log(req.params.level)

        // Set up the API request options
        const options = {
            method: "POST",
            url: "http://164.92.204.79/distractors",
            data: {
                word: word,
                n: n
            },
        };

        // Send the API request and get the response
        const response = await axios.request(options);

        // Extract the question, multiple-choice options, and answer from the response data
        let mcq = response.data.distractors;
        // console.log(mcq)
        // Send a success response
        res.json(mcq);
    } catch (error) {
        // If an error occurs, log it and pass it to the next error handling middleware
        console.error(error);
        next(error);
    }
}
