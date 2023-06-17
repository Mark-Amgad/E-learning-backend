
import { SpeechClient } from "@google-cloud/speech";
import credentials from '../../speech2text-credentials.json';
import SentenceModel from "../models/Sentence";

// To Be removed later when data is present in db
export const sentences = [
    'He found rain fascinating yet unpleasant.',
    'We need to rent a room for our party.',
    'We should play with legos at camp.',
    'Nancy was proud that she ran a tight shipwreck.'
]

export class Speech2TextService {
    speechClient: SpeechClient;
    config: any = {
        languageCode: 'en-US',
        encoding: "FLAC", 
        sampleRateHertz: '48000'
    }

    constructor() {
        const credentialsData = credentials;
        this.speechClient = new SpeechClient({
            credentials: credentialsData
        })
    }

    async transcriptSpeech (speechData: { id: number, audioBase64: string }) {
        const request = {
            audio: {
                content: speechData.audioBase64
            },
            config: this.config
        }

        const [results] = await this.speechClient.recognize(request)
        if (!results.results) throw new Error('No speech transcripted');
        console.dir(results, {depth: null})
        const transcript = results.results;

        const transcription = transcript
            .map((result: any) => result.alternatives![0].transcript)
            .join('\n');

        console.log(`Transcription: ${transcription}`);

        const sentence = await SentenceModel.findById(speechData.id)
        if(!sentence) throw Error()
        const data = this.checkAnswer(transcript, sentence.text)

        return data;
    }

    private checkAnswer(transcript: any, orignalSentence: string) {

        let transcription: string = transcript
            .map((result: any) => result.alternatives![0].transcript)
            .join('\n');
        transcription = this.strip(transcription)
        let transcriptionS = transcription.split(' ')
        let sentence = this.strip(orignalSentence)
        const orgWords = orignalSentence.split(' ')
        let isSimilar: boolean = true
        console.log(transcription, sentence)
    
        const matchedWords = sentence.split(' ').map((orgWord: string, index: number) => {
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

    private strip(str: string) {
        return str.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ").toLowerCase();
    }
}