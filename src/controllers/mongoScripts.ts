import QuestionModel from "../models/Question"
import McqCompleteQuestionModel from "../models/McqComQuestion"
import PlacementTestModel from "../models/PlacementTest";
import ListeningReadingQuestionModel from "../models/ListeningReadingQuestion";
import { Request, Response } from "express";
let transfer = async(req:Request,res:Response)=>{
    try
    {
        
        //let LRQuestions = await ListeningReadingQuestionModel.find({},{_id:0});
        //await QuestionModel.insertMany(mcqQuestions);
        //await QuestionModel.insertMany(LRQuestions);

        let mcqQuestions = await McqCompleteQuestionModel.find({},{_id:0});
        await QuestionModel.insertMany(mcqQuestions);


        // NOTE : the bext statment delete everything in the destiny collection
        /*
        let pipline = [
            {$project:{question:"$header", url:"$ImageUrl",subQuestions:"$questions",category:1,level:1}},
            {$out:"questions"}
        ];
        let result = await ListeningReadingQuestionModel.aggregate(pipline);
        */
        
        res.json({"2":"added"});
    }
    catch(err)
    {
        console.log(err);
    }
}


let placementTestBuild = async(req:Request,res:Response)=>
{
    try
    {
        await PlacementTestModel.insertMany(
            [
                {
                    "question": "I’m 18 and my brother is 20, so he’s\n........ me.",
                    "choices": [
                        "the oldest of",
                        "older than",
                        "as old as"
                    ],
                    "answer": "older than"
                },
                {
                    "question": "Carl’s very ........ . He’s never late, and he\nnever forgets to do things.",
                    "choices": [
                        "reliable",
                        "patient",
                        "strict"
                    ],
                    "answer": "reliable"
                },
                {
                    "question": "We stayed in a lovely villa ........ the sea.",
                    "choices": [
                        "it overlooks",
                        "overlooked",
                        "overlooking"
                    ],
                    "answer": "overlooking"
                },
                {
                    "question": "Not until the 1980s ........ for the average\nperson to own a computer.",
                    "choices": [
                        "it was possible",
                        "was it possible",
                        "was possible"
                    ],
                    "answer": "was it possible"
                },
                {
                    "question": "Jan ........ her arm on a hot iron.",
                    "choices": [
                        "broke",
                        "burned",
                        "sprained"
                    ],
                    "answer": "burned"
                },
                {
                    "question": "Tomorrow’s a holiday, so we ........ go to\nwork.",
                    "choices": [
                        "have to",
                        "mustn’t",
                        "don’t have to"
                    ],
                    "answer": "don’t have to"
                },
                {
                    "question": "I usually ........ swimming at least once a\nweek.",
                    "choices": [
                        "go",
                        "do",
                        "play"
                    ],
                    "answer": "go"
                },
                {
                    "question": "My friend Siena ........ to Russia last year.",
                    "choices": [
                        "went",
                        "has gone",
                        "has been"
                    ],
                    "answer": "went"
                },
                {
                    "question": "This is ........ area, with a lot of factories\nand warehouses.",
                    "choices": [
                        "an agricultural",
                        "an industrial",
                        "a residential"
                    ],
                    "answer": "an industrial"
                },
                {
                    "question": "If I ........ well in my exams, I ........ to\nuniversity.",
                    "choices": [
                        "will do; will go",
                        "will do; go",
                        "do; will go"
                    ],
                    "answer": "do; will go"
                },
                {
                    "question": "She was so upset that she burst ........\ntears.",
                    "choices": [
                        "into",
                        "out",
                        "with"
                    ],
                    "answer": "into"
                },
                {
                    "question": "Where did you go ........ holiday last\nyear?",
                    "choices": [
                        "for",
                        "on",
                        "to"
                    ],
                    "answer": "on"
                },
                {
                    "question": "Ocean currents ........ play an important\npart in regulating global climate.",
                    "choices": [
                        "are known to",
                        "thought to",
                        "are believed that they"
                    ],
                    "answer": "are known to"
                },
                {
                    "question": "My cousin ........ getting a job in Bahrain.",
                    "choices": [
                        "would like",
                        "is planning",
                        "is thinking of"
                    ],
                    "answer": "is thinking of"
                },
                {
                    "question": "I can’t ........ your hair, because I haven’t\ngot any scissors.",
                    "choices": [
                        "brush",
                        "cut",
                        "wash"
                    ],
                    "answer": "cut"
                },
                {
                    "question": "I wish I ........ have an exam tomorrow!",
                    "choices": [
                        "don’t",
                        "didn’t",
                        "won’t"
                    ],
                    "answer": "didn’t"
                },
                {
                    "question": "The government plans to ........ taxes on sales of luxury items.",
                    "choices": [
                        "increase",
                        "expand",
                        "go up"
                    ],
                    "answer": "increase"
                },
                {
                    "question": "When I first moved to Hong Kong, life in a different country was very strange, but now I’m used ........ here.",
                    "choices": [
                        "living",
                        "to live",
                        "to living"
                    ],
                    "answer": "to living"
                },
                {
                    "question": "There ........ milk in the fridge.",
                    "choices": [
                        "is some",
                        "are some",
                        "is a"
                    ],
                    "answer": "is some"
                },
                {
                    "question": "Criminals are people who are guilty of ........ the law.",
                    "choices": [
                        "breaking",
                        "cheating",
                        "committing"
                    ],
                    "answer": "breaking"
                },
                {
                    "question": "Why on earth isn’t Josh here yet? ........ for him for over an hour!",
                    "choices": [
                        "I’m waiting",
                        "I’ve been waiting",
                        "I’ve waited"
                    ],
                    "answer": "I’ve been waiting"
                },
                {
                    "question": "“It’s pouring down, and it’s freezing.” What are the weather conditions?",
                    "choices": [
                        "high winds and snow",
                        "heavy rain and cold temperatures",
                        "thick cloud but quite warm"
                    ],
                    "answer": "heavy rain and cold temperatures"
                },
                {
                    "question": "........ feeling OK? You don’t look very well.",
                    "choices": [
                        "Do you",
                        "You are",
                        "Are you"
                    ],
                    "answer": "Are you"
                },
                {
                    "question": "Daniel’s hair is getting far too long; he should ........ soon.",
                    "choices": [
                        "cut it",
                        "have cut it",
                        "have it cut"
                    ],
                    "answer": "have it cut"
                },
                {
                    "question": "Mandy works for a computer software company. She got ........ recently, and so now she’s an area manager.",
                    "choices": [
                        "made redundant",
                        "promoted",
                        "a raise"
                    ],
                    "answer": "promoted"
                },
                {
                    "question": "I can’t hear you – it’s ........ noisy in here.",
                    "choices": [
                        "too",
                        "too much",
                        "too many"
                    ],
                    "answer": "too"
                },
                {
                    "question": "Jamal has just sent me ........ to arrange plans for this weekend.",
                    "choices": [
                        "a blog",
                        "an email",
                        "a website"
                    ],
                    "answer": "an email"
                },
                {
                    "question": "I promise I’ll call you as soon as I ........ .",
                    "choices": [
                        "I arrive",
                        "I arrived",
                        "I’ll arrive"
                    ],
                    "answer": "I arrive"
                },
                {
                    "question": "Photographers and designers need to be very ........ .",
                    "choices": [
                        "creative",
                        "fit",
                        "annoying"
                    ],
                    "answer": "creative"
                },
                {
                    "question": "The global financial crisis, ........ is forcing lots of small businesses to close, does not look set to end soon.",
                    "choices": [
                        "it",
                        "that",
                        "which"
                    ],
                    "answer": "which"
                },
                {
                    "question": "There ........ a terrible accident if the pilot hadn’t reacted so quickly.",
                    "choices": [
                        "had been",
                        "was",
                        "would have been"
                    ],
                    "answer": "would have been"
                },
                {
                    "question": "“Are you ready to order?” “Not yet – I’m still looking at the ........ .”",
                    "choices": [
                        "bill",
                        "menu",
                        "service"
                    ],
                    "answer": "menu"
                },
                {
                    "question": "“My job is never boring.” The speaker’s job is always ........ .",
                    "choices": [
                        "interesting",
                        "popular",
                        "difficult"
                    ],
                    "answer": "interesting"
                },
                {
                    "question": "I’ve been working here ........ about the last two years.",
                    "choices": [
                        "during",
                        "for",
                        "since"
                    ],
                    "answer": "for"
                },
                {
                    "question": "It leaves from Platform 2 at 4.15. The speaker is talking about ........ .",
                    "choices": [
                        "an airline flight",
                        "a train",
                        "a taxi"
                    ],
                    "answer": "a train"
                },
                {
                    "question": "I went to a lovely ........ last Saturday. The bride was my best friend when we were at school.",
                    "choices": [
                        "anniversary",
                        "marriage",
                        "wedding"
                    ],
                    "answer": "wedding"
                },
                {
                    "question": "“I’ve got a headache.” “Maybe you ........ to take an aspirin.”",
                    "choices": [
                        "should",
                        "ought",
                        "don’t"
                    ],
                    "answer": "ought"
                },
                {
                    "question": "The patient had an ........ to insert metal pins in his broken leg.",
                    "choices": [
                        "injection",
                        "operation",
                        "X-ray"
                    ],
                    "answer": "operation"
                },
                {
                    "question": "She won a seat in parliament at the last ........ .",
                    "choices": [
                        "general election",
                        "opinion poll",
                        "referendum"
                    ],
                    "answer": "general election"
                },
                {
                    "question": "I’m surprised you didn’t get upset. If someone said that to me, ........ really angry.",
                    "choices": [
                        "I’m",
                        "I was",
                        "I’d be"
                    ],
                    "answer": "I'd be"
                },
                {
                    "question": "This used to be ........ part of the city, but since the old buildings were renovated it’s become a very fashionable area.",
                    "choices": [
                        "an affluent",
                        "a run-down",
                        "a trendy"
                    ],
                    "answer": "a run-down"
                },
                {
                    "question": "Cassie went to bed early because she was ........ .",
                    "choices": [
                        "tired",
                        "stressed",
                        "relaxed"
                    ],
                    "answer": "tired"
                },
                {
                    "question": "In the 1960s, computers were ........ expensive that ordinary people couldn’t afford them.",
                    "choices": [
                        "so",
                        "such",
                        "too"
                    ],
                    "answer": "so"
                },
                {
                    "question": "Do you want ........ the match tonight?",
                    "choices": [
                        "watching",
                        "watch",
                        "to watch"
                    ],
                    "answer": "to watch"
                },
                {
                    "question": "Researchers claim the new discovery is a major ........ in the fight against malaria.",
                    "choices": [
                        "breakthrough",
                        "investigation",
                        "progress"
                    ],
                    "answer": "breakthrough"
                },
                {
                    "question": "The Maths problem was really difficult and I just couldn’t ........ the answer.",
                    "choices": [
                        "check in",
                        "set off",
                        "work out"
                    ],
                    "answer": "work out"
                },
                {
                    "question": "When I was a child, I never ........ about the future.",
                    "choices": [
                        "have worried",
                        "used to worry",
                        "was worrying"
                    ],
                    "answer": "used to worry"
                },
                {
                    "question": "A local politician has ........ charges of corruption made by the opposition party.",
                    "choices": [
                        "accused",
                        "blamed",
                        "denied"
                    ],
                    "answer": "denied"
                },
                {
                    "question": "........ worries me about society today is how completely we have come to depend on technology.",
                    "choices": [
                        "That",
                        "What",
                        "Which"
                    ],
                    "answer": "What"
                },
                {
                    "question": "Cats and dogs are usually kept as ..........",
                    "choices": [
                        "farm animals",
                        "wild animals",
                        "pets"
                    ],
                    "answer": "pets"
                }
            ]
        );
        res.json("Done building");
    }
    catch(err)
    {
        res.json("error in building palcement test");
    }
}

export {transfer,placementTestBuild};

