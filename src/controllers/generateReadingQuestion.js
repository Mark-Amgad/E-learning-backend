import ParagraphModel from "../models/Paragraph";
import ListeningReadingQuestionModel from "../models/ListeningReadingQuestion";
const axios = require("axios");


export function generateReadingQuestion(req, res) {
    level = req.params.level;
    paragraph = ParagraphModel.findOne({ "level": level })

    const encodedParams = new URLSearchParams();
    encodedParams.append("context", paragraph.text);
    encodedParams.append("n_mcq", 4);
    encodedParams.append("n_ques", 5);

    const options = {
        method: 'POST',
        url: 'http://164.92.176.13/mcq',
        data: encodedParams
    };

    axios.request(options).then(function (response) {
        // console.log(response.data);
        questions = response.data["questions"];
        insertedQuestions = []
        for (ques in questions) {
            insertedQuestions.append({
                question: ques.question,
                choices: ques.mcq,
                answer: ques.answer, type: "mcq"
            })
        }
        readingQuestion = {
            header: paragraph.text,
            questions: insertedQuestions,
            hasImage: false,
            imageUrl: "",
            category: "",
            level: paragraph.level,
        }
        ListeningReadingQuestionModel.collection.insertOne(readingQuestion)
        res.json("Question Generated successfully");
    }).catch(function (error) {
        console.error(error);
    });
}