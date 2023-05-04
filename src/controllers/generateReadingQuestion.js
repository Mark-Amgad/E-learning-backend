import ParagraphModel from "../models/Paragraph";
import ListeningReadingQuestionModel from "../models/ListeningReadingQuestion";
const axios = require("axios");


export async function generateReadingQuestion(req, res) {
    console.log("111111111111111111")
    let level = req.params.level;
    console.log(req.params.level)
    // level ="A1"
    let paragraph = await ParagraphModel.findOne({ "level": level })
    console.log(paragraph)
    // const encodedParams = new URLSearchParams();
    // encodedParams.append("context", paragraph.text);
    // encodedParams.append("n_mcq", 4);
    // encodedParams.append("n_ques", 5);

    const options = {
        method: 'POST',
        url: 'http://164.92.176.13/mcq',
        data: {
            "n_mcq":4,
            "context":paragraph.text,
            "n_ques": 5
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        let questions = response.data["questions"];
        console.log(questions)
        let insertedQuestions = []

        for (let ques of questions) {
            insertedQuestions.push({
                question: ques.question,
                choices: ques.mcq,
                answer: ques.answer, 
                type: "MCQ"
            })
        }
        let readingQuestion = {
            header: paragraph.text,
            questions: insertedQuestions,
            hasImage: false,
            imageUrl: "",
            category: "Reading",
            level: level,
        }
        ListeningReadingQuestionModel.collection.insertOne(readingQuestion)
        res.json("Question Generated successfully");
    }).catch(function (error) {
        console.error(error);
    });
}