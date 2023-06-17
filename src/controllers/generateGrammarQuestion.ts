import QuestionModel from "../models/Question";
import { generateMcqQ, generateTorFQ } from "../external_modules/grammar_classification/grammarQuestions";
import express from "express";
import SentenceModel from "../models/Sentence"

/**
 * Generates a grammar question based on the requested level.
 * @param req - The request object containing the level parameter.
 * @param res - The response object to send the generated question.
 */
export async function generateGrammarQuestion(req: express.Request, res: express.Response) {
    try {

        const level: string = req.params.level;
        // console.log(level);

        const randomTopic: string = getTopicByLevel(level);
        // console.log(randomTopic);

        const sentenceAns = await getSentenceByTopic(randomTopic, level);
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
            generatedQuestion = {
                question: sentenceAns.sentence,
                mcq: shuffleArray(randomTopic.split("/")),
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

export async function generateGrammarQuestionDemo(req: express.Request, res: express.Response) {
    try {
        const level: string = req.body.level;
        const randomTopic: string = req.body.topic;
        const sentence: string = req.body.sentence;
        // console.log(level);
        // console.log(randomTopic);

        const sentenceAns = await getSentenceByTopicForDemo(randomTopic, level, sentence);
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
            generatedQuestion = {
                question: sentenceAns.sentence,
                mcq: shuffleArray(randomTopic.split("/")),
                answer: sentenceAns.answer,
            };
        }

        // console.log(generatedQuestion);

        res.json([generatedQuestion]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function generateGrammarQuestionDemoV2(req: express.Request, res: express.Response) {
    try {
        const level: string = req.body.level;
        const sentence: string = req.body.sentence;
        // console.log(level);
        // console.log(randomTopic);
        const randomTopic: string = getTopicByLevel(level);

        const sentenceAns = await getSentenceByTopicForDemo(randomTopic, level, sentence);
        // console.log(sentenceAns);

        if (!sentenceAns) {
            console.log("Sentence not found");
            return res.status(404).json({ message: "Can't make question with that topic and sentence" });
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
            generatedQuestion = {
                question: sentenceAns.sentence,
                mcq: shuffleArray(randomTopic.split("/")),
                answer: sentenceAns.answer,
            };
        }

        // console.log(generatedQuestion);

        res.json([generatedQuestion]);
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
async function getSentenceByTopic(topic: string, level: string): Promise<{ sentence: string, answer: string } | null> {

    const sentences = await SentenceModel.find({ "level": level });

    // If no sentence is found, return null
    if (!sentences) {
        return null;
    }
    // this block used only for testing
    // const sentences = [
    //     {
    //         text: "The waitress was not amused when he ordered green eggs and ham.",
    //         level: "A1",
    //     },
    //     {
    //         text: "I currently have 4 windows open up… and I don't know why.",
    //         level: "B1",
    //     },
    //     {
    //         text: "Jeanne wished she has chosen the red button.",
    //         level: "A1",
    //     },
    // ];

    let filteredSentences = sentences.filter((sentence) => sentence.level === level);
    const keywords = topic.split("/");
    const isTense = keywords[0].toLowerCase() === "tense";
    filteredSentences = shuffleArray(filteredSentences);

    if (isTense) {
        let randomSentence = filteredSentences[getRandomIndex(filteredSentences)];
        return { sentence: randomSentence.text, answer: keywords[0] };
    }

    for (const word of keywords) {
        for (const sent of filteredSentences) {
            let regexPattern: string = `(?<=\\s)${word}(?=\\s)`;
            let regex: RegExp = new RegExp(regexPattern, 'i');
            let match = sent.text.match(regex);
            if (match) {
                let replacedString = sent.text.replace(regex, ".......");
                return { sentence: replacedString, answer: word };
            }
        }
    }

    return null
}

async function getSentenceByTopicForDemo(topic: string, level: string, sentence: string): Promise<{ sentence: string, answer: string } | null> {

    const keywords = topic.split("/");
    const isTense = keywords[0].toLowerCase() === "tense";

    if (isTense) {
        return { sentence: sentence, answer: keywords[0] };
    }

    for (const word of keywords) {
        let regexPattern: string = `(?<=\\s)${word}(?=\\s)`;
        let regex: RegExp = new RegExp(regexPattern, 'i');
        let match = sentence.match(regex);
        if (match) {
            let replacedString = sentence.replace(regex, ".......");
            return { sentence: replacedString, answer: word };
        }
    }

    return null
}
function getRandomIndex(arr: any[]): number {
    return Math.floor(Math.random() * arr.length);
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**

Retrieves a random topic from the given array of topics.
@param topics - The array of topics.
@returns A random topic from the array.
*/
function getRandomTopic(topics: string[]): string {
    const randomIndex: number = getRandomIndex(topics);
    const randomTopic: string = topics[randomIndex];
    return randomTopic;
}

/**
 
Retrieves a random topic based on the given level.
@param level - The level of the topic.
@returns A random topic based on the level.
*/
function getTopicByLevel(level: string): string {
    const Topics: { [key: string]: string[] } = {
        "A1": ["am/is/are", "This/That/These/Those", "a/an", "Tense/Present simple", "Who/What/When/Where", "I/He/it", "We/You/They", "in/on/at", "His/Her/My/Our", "My/Their/Its/Your", "Do/Does/Did", "Always/Usually/Often/sometimes", "Tense/Past continuous", "always/Hardly/Never/none", "Can/Can't/could/couldn't", "Tense/Present Continuous", "Was/Were/when", "none/some/any", "much/many/none/a lot of", "a lot of/a little/a few/any/none", "Tense/Past simple", "next/under/between/in front of", "behind/over/next/opposite", "And/but/or/so/because", "Will/Shall/Would"],

        "A2": ["Has/Have/Had", "Tense/Past simple", "Tense/Past continuous", "although/because/so/but", "something/anything/nothing/always", "to/for/too/none", "Tense/Present Perfect", "Some/Any/No/every", "Too/too much/too many/enough", "Most/most of/the most", "shall/should/ shouldn't/would", "Tense/past participle", "get use to/Used to/didn't use to/use", "Might/might not/may/may not", "So/neither/either/as", "Tense/Past perfect", "Do/Make/Does"],

        "B1": ["Tense/present perfect continuous", "Tense/Future forms", "During/for/while/when", "Another/other/others/ the other/ the others", "bring up/come on/carry on/call for", "Tense/present perfect simple", "All/Both/either/neither/none", "Tense/Past Perfect", "For/since/from/to", "can/could/be able to/able", "set out/put out/rang up", "must/mustn't/have to/don't have to", "set up/put up/showed up", "least/less/more/few", "in/of/from", "can/will/could/shall"],

        "B2": ["Tense/ Present perfect simple", "have/has/had", "so many/such/so/so much/such a", "Whether/Even if/Suppose/supposing", "Tense/ Present perfect continuous", "verge/point of/Be due to/Be to", "Tense/future in the past", "Likely/unlikely/like/bound", "Whatever/whenever/wherever/whoever/however", "Pretty/rather/quite/fairly"],

        "C1": ["himself/oneself/myself/itself", "although/because/so/but", "something/anything/nothing/always", "Tense/Present Perfect continuous", "me/my/I/mine", "yourself/you/your", "ourself/us/themselves/our", "Wish/rather/if only/it's time", "Unless/In case/As long as", "only if/Whether/Even if", "Tense/ Present perfect continuous"],

        // "C2": ["Subject/Complex conditionals", "verbs/complex modal verbs", "Nouns/Advanced quanifiers", "Verbs/advanced adverbials", "Nouns/advnaced nounes", "Adjectives/adjective clauses", "Verbs/advnaced verb forms", "Verbs/Phrasal verbs"]
    };

    const topics: string[] = Topics[level];
    const randomTopic: string = getRandomTopic(topics);

    return randomTopic;
}

// Test functionality
// generateGrammarQuestion({ params: { level: "A1" } }, {});

