import torch
import nltk
from flashtext import KeywordProcessor
import nltk
from nltk.tokenize import sent_tokenize
nltk.download('punkt')
nltk.download('stopwords')
from nltk.corpus import stopwords
import string
import pke
import traceback
from fastT5 import get_onnx_model,get_onnx_runtime_sessions,OnnxT5
from transformers import AutoTokenizer
from pathlib import Path
import os
import random
import numpy as np
from sense2vec import Sense2Vec
from sentence_transformers import SentenceTransformer
from Questiongen import distrctors
class QGen:
    
    def __init__(self):
        trained_model_path = './t5_squad_v1/'
        pretrained_model_name = Path(trained_model_path).stem
        encoder_path = os.path.join(trained_model_path,f"{pretrained_model_name}-encoder-quantized.onnx")
        decoder_path = os.path.join(trained_model_path,f"{pretrained_model_name}-decoder-quantized.onnx")
        init_decoder_path = os.path.join(trained_model_path,f"{pretrained_model_name}-init-decoder-quantized.onnx")

        model_paths = encoder_path, decoder_path, init_decoder_path
        model_sessions = get_onnx_runtime_sessions(model_paths)

        model = OnnxT5(trained_model_path, model_sessions)
        tokenizer = AutoTokenizer.from_pretrained(trained_model_path)
        
        self.tokenizer = tokenizer
        self.model = model

        self.set_seed(42)
        
        self.s2v = Sense2Vec().from_disk('s2v_old')
        self.s_t_model = SentenceTransformer('msmarco-distilbert-base-v3')
        
    def set_seed(self,seed):
        random.seed(seed)
        np.random.seed(seed)
        torch.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)

            
    def predict_mcq(self, payload,n_ques,n_mcq):
        keywords = self.get_nouns_multipartite(payload)
        keywords = distrctors.filter_keywords(keywords,self.s2v)
        random.shuffle(keywords)
        sent_kekword_map = keyword_sentence_map(payload,keywords)
        n = min(n_ques,len(sent_kekword_map.keys()))
        questions = []
        keys = list(sent_kekword_map)
        for i in range(n):
            question = self.get_question(sent_kekword_map[keys[i]],keys[i])
            mcq = distrctors.get_distractors(keywords[i],question,self.s2v,self.s_t_model,40,0.2)[:n_mcq]
            random.shuffle(mcq)
            questions.append({'question':question,'mcq':mcq,'answer':keywords[i].capitalize()})

        return questions
            

    def get_nouns_multipartite(self,content):
        out=[]
        try:
            extractor = pke.unsupervised.MultipartiteRank()
            extractor.load_document(input=content,language='en')
            #    not contain punctuation marks or stopwords as candidates.
            pos = {'PROPN','NOUN'}
            #pos = {'PROPN','NOUN'}
            stoplist = list(string.punctuation)
            stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
            stoplist += stopwords.words('english')
            # extractor.candidate_selection(pos=pos, stoplist=stoplist)
            extractor.candidate_selection(pos=pos)
            # 4. build the Multipartite graph and rank candidates using random walk,
            #    alpha controls the weight adjustment mechanism, see TopicRank for
            #    threshold/method parameters.
            extractor.candidate_weighting(alpha=1.1,
                                        threshold=0.75,
                                        method='average')
            keyphrases = extractor.get_n_best(n=15)
            

            for val in keyphrases:
                out.append(val[0])
        except:
            out = []
            traceback.print_exc()

        return out
    def get_question(self,sentence,answer):
        text = "context: {} answer: {}".format(sentence,answer)
        print (text)
        max_len = 256
        encoding = self.tokenizer.encode_plus(text,max_length=max_len, pad_to_max_length=False,truncation=True, return_tensors="pt")

        input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]

        outs = self.model.generate(input_ids=input_ids,
                                        attention_mask=attention_mask,
                                        early_stopping=True,
                                        num_beams=5,
                                        num_return_sequences=1,
                                        no_repeat_ngram_size=2,
                                        max_length=150)


        dec = [self.tokenizer.decode(ids,skip_special_tokens=True) for ids in outs]

        Question = dec[0].replace("question:","")
        Question= Question.strip()
        return Question

def tokenize_sentences(text):
    sentences = [sent_tokenize(text)]
    sentences = [y for x in sentences for y in x]
    # Remove any short sentences less than 20 letters.
    sentences = [sentence.strip() for sentence in sentences if len(sentence) > 20]
    return sentences

def get_sentences_for_keyword(keywords, sentences):
    keyword_processor = KeywordProcessor()
    keyword_sentences = {}
    for word in keywords:
        word = word.strip()
        keyword_sentences[word] = []
        keyword_processor.add_keyword(word)
    for sentence in sentences:
        keywords_found = keyword_processor.extract_keywords(sentence)
        for key in keywords_found:
            keyword_sentences[key].append(sentence)

    for key in keyword_sentences.keys():
        values = keyword_sentences[key]
        values = sorted(values, key=len, reverse=True)
        keyword_sentences[key] = values

    delete_keys = []
    for k in keyword_sentences.keys():
        if len(keyword_sentences[k]) == 0:
            delete_keys.append(k)
    for del_key in delete_keys:
        del keyword_sentences[del_key]

    return keyword_sentences

def keyword_sentence_map(text,keywords):
    sentences = tokenize_sentences(text)

    keyword_sentence_mapping = get_sentences_for_keyword(keywords, sentences)
    for k in keyword_sentence_mapping.keys():
        text_snippet = " ".join(keyword_sentence_mapping[k][:3])
        keyword_sentence_mapping[k] = text_snippet
    
    return keyword_sentence_mapping
