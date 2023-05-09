import QuestionModel from "../models/Question";
import { generateMcqQ, generateTorFQ } from "../external_modules/grammar_classification/grammarQuestions";
import express from "express";

/**
 * Generates a grammar question based on the requested level.
 * @param req - The request object containing the level parameter.
 * @param res - The response object to send the generated question.
 */
export async function generateGrammarQuestion(req: any, res: any) {
    try {
        const level: string = req.params.level;
        // console.log(level);

        const randomTopic: string = getTopicByLevel(level);
        // console.log(randomTopic);

        const sentenceAns = getSentenceByTopic(randomTopic, level);
        // console.log(sentenceAns);

        if (!sentenceAns) {
            console.log("Sentence not found");
            return res.status(404).json({ message: "Sentence not found" });
        }

        const isTense: boolean = randomTopic.split("/")[0].toLowerCase() === "tense";
        let generatedQuestion: any = null;

        if (isTense) {
            const randomNum: number = Math.floor(Math.random() * 2) + 1;
            if (randomNum === 1) {
                generatedQuestion = await generateMcqQ(sentenceAns.sentence);
            } else {
                generatedQuestion = await generateTorFQ(sentenceAns.sentence);
            }
        } else {
            const sentArray = sentenceAns.sentence.split(" ");
            let answer = sentenceAns.answer.toLowerCase();
            // Find the index of the element
            let index = sentArray.indexOf(answer);

            // If the element is found, replace it with the new value
            if (index !== -1) {
                sentArray[index] = ".......";
            }
            generatedQuestion = {
                question: sentArray.join(" "),
                mcq: randomTopic.split("/"),
                answer: sentenceAns.answer,
            };
        }

        // console.log(generatedQuestion);

        const { question, mcq, answer } = generatedQuestion;

        // Create a new Grammar question object
        const grammarQuestion = new QuestionModel({
            question,
            choices: mcq,
            answer,
            type: "MCQ",
            category: "Grammar",
            level,
            url: "",
        });

        // Save the Grammar question to the database
        await grammarQuestion.save();

        // Send a success response
        res.json({ message: "Question generated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Retrieves a sentence and its answer based on the topic and level.
 * @param topic - The topic of the sentence.
 * @param level - The level of the sentence.
 * @returns The sentence and its answer as an object, or null if not found.
 */
function getSentenceByTopic(topic: string, level: string): { sentence: string, answer: string } | null {
    const sentences = [
        {
            text: "The waitress was not amused when he ordered green eggs and ham.",
            level: "A1",
        },
        {
            text: "I currently have 4 windows open up… and I don't know why.",
            level: "B1",
        },
        {
            text: "Jeanne wished she has chosen the red button.",
            level: "A1",
        },
    ];

    const filteredSentences = sentences.filter((sentence) => sentence.level === level);
    const keywords = topic.split("/");
    const isTense = keywords[0].toLowerCase() === "tense";

    if (isTense) {
        return { sentence: filteredSentences[0].text, answer: keywords[0] };
    }

    for (const word of keywords) {
        for (const sent of filteredSentences) {
            const sentArray = sent.text.split(" ");

            if (sentArray.includes(word.toLowerCase())) {
                return { sentence: sent.text, answer: word };
            }
        }
    }

    return null
}

/**

Retrieves a random topic from the given array of topics.
@param topics - The array of topics.
@returns A random topic from the array.
*/
function getRandomTopic(topics: string[]): string {
    const randomIndex: number = Math.floor(Math.random() * topics.length);
    const randomTopic: string = topics[randomIndex];
    return randomTopic;
}

/**
 
Retrieves a random topic based on the given level.
@param level - The level of the topic.
@returns A random topic based on the level.
*/
function getTopicByLevel(level: string): string {
    // "A1": ["am/is/are", "This/That/These/Those", "a/an", "Tense/Present simple", "Who/What/When/Where", "I/he/it", "We/You/They", "in/on/at"],
    const Topics: { [key: string]: string[] } = {
        "A1": ["I/He/It"],
        "A2": ["Tense/Present continuous", "Tense/Past simple", "something/anything/nothing"],
        "B1": [],
        "B2": [],
        "C1": [],
        "C2": [],
    };
    const topics: string[] = Topics[level];
    const randomTopic: string = getRandomTopic(topics);

    return randomTopic;
}

// Test functionality
generateGrammarQuestion({ params: { level: "A1" } }, {});

