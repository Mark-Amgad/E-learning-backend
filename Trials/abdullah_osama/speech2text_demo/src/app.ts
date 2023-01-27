import express from 'express'
import path from 'path'
import { SpeechClient } from '@google-cloud/speech'
import s from './speech2text-demo-372421-fb213717a34a.json'
const app = express();

app.use(express.json({
    limit: '10mb'
}))

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile('views/main.html', { root: __dirname });
})

const sentences = [
    'He found rain fascinating yet unpleasant.',
    'We need to rent a room for our party.',
    'We should play with legos at camp.',
    'Nancy was proud that she ran a tight shipwreck.'
]
app.get('/speech2text/', (req, res) => {
    const id = Math.floor(Math.random() * sentences.length);
    res.send({ sentence: sentences[id], id })
})
app.post('/speech2text/', async (req, res) => {
    const transcript = await transcriptSpeech(req.body.audioBase64)
    
    const transcription = transcript!
    .map(result => result.alternatives![0].transcript)
    .join('\n');
    console.log(`Transcription: ${transcription}`);
    res.status(200).send({ data: checkAnswer(transcript, sentences[req.body.id])}).end();

})
app.listen(3000, () => {
    console.log('Server Has started!!!')
})


async function transcriptSpeech(audioBase64: string) {
    // console.log(data)
    const speech = new SpeechClient({
        credentials: s
    })

    const audio = {
        content: audioBase64
    }
    const config: any = {
        languageCode: 'en-US',
        encoding: "FLAC",
        sampleRateHertz: '48000'
    }
    const request = {
        audio,
        config
    }

    const [response] = await speech.recognize(request)
    if (!response.results) return;
    console.dir(response, {depth: null})
    return response.results;

        

}


function strip(str: string) {
    return str.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ").toLowerCase();
}

function checkAnswer(transcript: any, orignalSentence: string) {

    let transcription: string = transcript
        .map((result: any) => result.alternatives![0].transcript)
        .join('\n');
    transcription = strip(transcription)
    let transcriptionS = transcription.split(' ')
    let sentence = strip(orignalSentence)
    const orgWords = orignalSentence.split(' ')
    let isSimilar: boolean = true
    console.log(transcription, sentence)

    const matchedWords = sentence.split(' ').map((orgWord, index) => {
        const ret = {
            word: orgWords[index],
            matched: false
        }
        if (index < transcriptionS.length && transcriptionS[index] == orgWord) ret.matched = true; 
        else isSimilar = false

        return ret;
    })
    return { isSimilar, matchedWords }
}