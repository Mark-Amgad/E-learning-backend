import SentenceModel from "../models/Sentence";
import { Speech2TextService, sentences } from "../services/speech2textService";
import express from 'express';

export class SpeechController {

  speech2TextService: Speech2TextService;

  constructor() {
        this.speech2TextService = new Speech2TextService();
  }

  async getSentence(req: express.Request, res: express.Response) {
    const level = req.query.level;
    if(!level) {
      return res.status(400).send();
    }
    const sentences = await SentenceModel.aggregate([{'$match': { level }}, {'$sample': { size: 1 }}])
    if(!sentences) {
      return res.status(404).send('Sentence with this level was not found').send();
    }
    res.send({ sentence: sentences[0].text, id: sentences[0]._id })
    }

    async evaluateSpeech(req: express.Request, res: express.Response) {
        try {
            console.log('here', req.body)
            const result = await this.speech2TextService.transcriptSpeech(req.body);
            res.send({ data: result });
        } catch (err) {
            // handling errors
            console.log(err)
            res.status(500).send('Error');
        }
    }
}