import ParagraphModel from "../models/Paragraph";
import Question from "../models/Question";
const axios = require("axios");


export async function generateReadingQuestion(req, res) {
    let level = req.params.level;
    // console.log(req.params.level)
    let paragraphs = await ParagraphModel.find({ "level": level })
    let indx = getRandomIndex(paragraphs);
    let paragraph = paragraphs[indx];
    // console.log(paragraph)
    // const encodedParams = new URLSearchParams();
    // encodedParams.append("context", paragraph.text);
    // encodedParams.append("n_mcq", 4);
    // encodedParams.append("n_ques", 5);

    const options = {
        method: 'POST',
        url: 'http://164.92.204.79/mcq',
        data: {
            "context": paragraph.text,
            "n_mcq": 4,
            "n_ques": 5
        }
    };

    axios.request(options).then(function (response) {
        // console.log(response.data);
        let questions = response.data["questions"];
        // console.log(questions)
        let insertedQuestions = []
        if (questions.length === 5) {
            for (let ques of questions) {
                insertedQuestions.push({
                    question: ques.question,
                    choices: ques.mcq,
                    answer: ques.answer,
                })
            }
            let readingQuestion = {
                question: paragraph.text,
                subQuestions: insertedQuestions,
                choices: [],
                answer: "",
                type: "MCQ",
                category: "Reading",
                level: level,
                url: ""
            }
            Question.collection.insertOne(readingQuestion)
            res.json("Question Generated successfully");
        } else {
            res.json("Generated Question less than 5")
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function getRandomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
}