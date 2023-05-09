
import stanza

import re
nlp = stanza.Pipeline(lang='en', processors='tokenize,mwt,pos,lemma', verbose=False)

def MatchVerb(verb, sentence): 
    # print(sentence, len(sentence))
    for index in range(len(sentence) - 1, -1, -1):
        word = sentence[index]
        matching = re.search('VB.?', word.xpos) 
        if matching:
            # print(word.xpos)
            if(word.xpos in verb): 
                return True, index
            # else: 
            #     return False

    return False

def getPOS(sentences):
    doc = nlp(sentences)
    # print(*[f'word: {word.text}\tupos: {word.upos}\txpos: {word.xpos}\tfeats: {word.feats if word.feats else "_"}' for sent in doc.sentences for word in sent.words], sep='\n')
    sent = doc.sentences
    words = sent[0].words
    return words

def doCase(sentence):

    for word in sentence:
        if word.upos == 'AUX' and word.text.lower() in ['do', 'does']:
            return True
        
    return False

def to(sentence):
    for word in sentence:
        if word.xpos == 'TO':
            return True
    return False


def isModal(sentence):
    for word in sentence:
        # if word.text in ['can', 'could', 'might', 'should', 'would', 'may', 'must', 'shall', 'will']:
        if word.xpos == 'MD':
            return True

    return False

def didCase(sentence):
    for word in sentence:
        if word.text == 'did':
            return True
    return False

def have(sentence):
    for word in sentence:
        if word.text in ['have', 'has']:
            return True
    return False


def had(sentence):
    for word in sentence:
        if word.text == 'had':
            return True
    return False


def notVbg(sentence):
    for word in sentence:
        if word.xpos == 'VBG':
            return False
    return True

def beAfterHad(sentence):
    hadPos = -1
    for index in range(0, len(sentence)):
        if sentence[index].text == 'had':
            hadPos = index
            break

    if hadPos == -1:
        return False
    
    if sentence[hadPos + 1].text in ['be']:
        return True

    return False


def jjB4Vbg(sentence):
    vbgPos = -1
    for index in range(0, len(sentence)):
        if sentence[index].xpos == 'VBG':
            vbgPos = index

    if vbgPos == -1:
        return False
    if sentence[vbgPos - 1].xpos == 'JJ':
        return True
    
    return False

def vbgPrecededByFor(sentence):
    vbgPos = -1
    for index in range(0, len(sentence)):
        if sentence[index].xpos == 'VBG':
            vbgPos = index

    if vbgPos == -1:
        return False
    
    if sentence[vbgPos - 1].text in ['for', 'and', 'of'] or sentence[vbgPos - 1].xpos == 'PRP$':
        return True    
    return False


def going(sentence):
    for word in sentence:
        if word.text == 'going':
            return True
        
    return False


def vb(sentence):
    for word in sentence:
        if word.upos == 'VERB':
            return True
    return False

def be(sentence, toBes = ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being']):
    for word in sentence:
        if word.text in toBes:
            return True        
    return False

def bePresent(sentence):
    return be(sentence, ['am', 'is', 'are', 'being'])
    
def bePast(sentence):
    return be(sentence, ['was', 'were', 'being'])


def will(sentence):
    for word in sentence:
        if word.text == 'will' and word.upos == 'AUX':
            return True
    return False

def vbn(sentence):
    for word in sentence:
        if word.xpos == 'VBN':
            return True
    return False



def preceddedByDT(sentence):
    vb = -1
    for index in range(0, len(sentence)):
        if sentence[index].upos == 'VERB':
            vb = index

    if vb != -1 and sentence[vb - 1].xpos == 'DT':
        return True
    return False

def noVerbBetweenWillNVerb(sentence):

    verb = -1
    will = -1
    
    for index in range(0, len(sentence)):
        if sentence[index].text == 'will':
            will = index
        if re.match('VB', sentence[index].xpos):
            verb = index
    
    if verb == -1 or will == -1:
        return True
    
    for ind in range(will + 1, verb):
        if re.match('VB', sentence[ind].xpos):
            return False

    return True

def vbBetweenVbnNvbg(sentence): 
    vbn = -1
    vbg = -1
    
    for index in range(0, len(sentence)):
        if sentence[index].xpos == 'VBN':
            vbn = index
        if sentence[index].xpos == 'VBG':
            vbg = index
    
    if vbn == -1 or vbg == -1:
        return False
    
    for index in range(vbn + 1, vbg):
        if re.match('VB', sentence[index].xpos):
            return True
        
    return False
# Still trying to figure it out
def initSurroundedByNouns(sentence):

    return False

def noNoun(sentence):
    return True
    return False


def toVb(sentence):

    return False

def notVbn(sentence):
    return not vbn(sentence)

def notHave(sentence):
    return not have(sentence)

def preceddedByVb(sentence):

    return False


def vbBetweenToBeAndVbg(sentence):
    vbg = -1
    be = -1

    for index in range(0, len(sentence)):
        if sentence[index].text in ['been', 'be', 'being']:
            be = index
            break

    for index in range(be + 1, len(sentence)):
        if sentence[index].xpos == 'VBG':
            vbg = index
            break

    if be == -1 or vbg == -1:
        return False

    return vb(sentence[be: vbg])

def vbgBetweenVbgNBe(sentence):
    vbg = -1
    be = -1
    for index in range(0, len(sentence)):
        if sentence[index].xpos == 'VBG':
            vbg = index
            break

    for index in range(vbg + 1, len(sentence)):
        if sentence[index].text in ['been', 'be', 'being']:
            be = index
            break
    
    if be == -1 or vbg == -1:
        return False
    
    return not notVbg(sentence[vbg: be])
    
    
def goingTo(sentence):
    for index in range(0, len(sentence) - 1):
        if sentence[index].text + ' ' + sentence[index + 1].text == 'going to':
            return True
    return False

def notGoingTo(sentence):
    return not goingTo(sentence)

def isPresentSimple(sentence):
    match = MatchVerb(['VB', 'VBZ', 'VBP'], sentence)
    if (match or doCase(sentence)) \
        and not to(sentence) and not isModal(sentence):
            return True, match[1]
    return False

def isPresentContinuous(sentence):
    match = MatchVerb(['VBG'], sentence)
    if match and bePresent(sentence) and notVbn(sentence) and notGoingTo(sentence) \
        and not to(sentence) and not jjB4Vbg(sentence) and not initSurroundedByNouns(sentence) \
        and not preceddedByDT(sentence) and not vbBetweenToBeAndVbg(sentence) \
        and not preceddedByVb(sentence) and not vbgPrecededByFor(sentence):
            return True, match[1]
    return False

def isPresentPerfect(sentence):
    match = MatchVerb(['VBD', 'VBN', 'VB'], sentence)
    if match and have(sentence) and noNoun(sentence) and not toVb(sentence):
        return True, match[1]
    return False

def isPresentPerfectContinuous(sentence):

    match = MatchVerb(['VBG'], sentence) 
    if match and have(sentence) and vbn(sentence) and not jjB4Vbg(sentence) and not toVb(sentence) \
        and not vbBetweenVbnNvbg(sentence) and not preceddedByDT(sentence):
            return True, match[1]
    return False

def isPastSimple(sentence):
    match = MatchVerb(['VBD'], sentence) 
    if match or didCase(sentence):
        return True, match[1]
    return False

def isPastContinuous(sentence):
    match = MatchVerb(['VBG'], sentence)
    if match and be(sentence) and notVbn(sentence) and notHave(sentence) and not goingTo(sentence) \
        and not jjB4Vbg(sentence) and not vbgBetweenVbgNBe(sentence) and not initSurroundedByNouns(sentence) \
        and not preceddedByDT(sentence) and not preceddedByVb(sentence) and not vbgPrecededByFor(sentence):
            return True, match[1]
    return False

def isPastPerfect(sentence):
    match = MatchVerb(['VBD', 'VBN', 'VB'], sentence)
    if match and had(sentence) and notVbg(sentence) and noNoun(sentence) and not toVb(sentence) \
        and not beAfterHad(sentence) and not initSurroundedByNouns(sentence):
        return True, match[1]
    return False

def isPastPerfectContinuous(sentence):
    match = MatchVerb(['VBG'], sentence)
    if match and had(sentence) and vbn(sentence) and not jjB4Vbg(sentence) \
        and not toVb(sentence) and not vbBetweenToBeAndVbg(sentence) and not preceddedByDT(sentence):
            return True, match[1]
    return False

def isFutureSimple(sentence):
    match = MatchVerb(['VB', 'VBP'], sentence) 
    if match and will(sentence) and noVerbBetweenWillNVerb(sentence):
        return True, match[1]
    return False


def isFutureGoingTo(sentence):
    match = MatchVerb(['VB', 'VBP'], sentence)
    if match and going(sentence) and to(sentence) and vb(sentence):
        return True, match[1]
    return False

def isFutureContinuous(sentence):
    match = MatchVerb(['VBG'], sentence)
    if match and will(sentence) and be(sentence) and not jjB4Vbg(sentence) and not preceddedByDT(sentence) \
        and not vbgPrecededByFor(sentence):
            return True, match[1]
    return False





cList = {
    "ain't": "am not",
    "aren't": "are not",
    "can't": "cannot",
    "can't've": "cannot have",
    "'cause": "because",
    "could've": "could have",
    "couldn't": "could not",
    "couldn't've": "could not have",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hadn't've": "had not have",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he would",
    "he'd've": "he would have",
    "he'll": "he will",
    "he'll've": "he will have",
    "he's": "he is",
    "how'd": "how did",
    "how'd'y": "how do you",
    "how'll": "how will",
    "how's": "how is",
    "i'd": "I would",
    "i'd've": "I would have",
    "i'll": "I will",
    "i'll've": "I will have",
    "i'm": "I am",
    "i've": "I have",
    "isn't": "is not",
    "it'd": "it had",
    "it'd've": "it would have",
    "it'll": "it will",
    "it'll've": "it will have",
    "it's": "it is",
    "let's": "let us",
    "ma'am": "madam",
    "mayn't": "may not",
    "might've": "might have",
    "mightn't": "might not",
    "mightn't've": "might not have",
    "must've": "must have",
    "mustn't": "must not",
    "mustn't've": "must not have",
    "needn't": "need not",
    "needn't've": "need not have",
    "o'clock": "of the clock",
    "oughtn't": "ought not",
    "oughtn't've": "ought not have",
    "shan't": "shall not",
    "sha'n't": "shall not",
    "shan't've": "shall not have",
    "she'd": "she would",
    "she'd've": "she would have",
    "she'll": "she will",
    "she'll've": "she will have",
    "she's": "she is",
    "should've": "should have",
    "shouldn't": "should not",
    "shouldn't've": "should not have",
    "so've": "so have",
    "so's": "so is",
    "that'd": "that would",
    "that'd've": "that would have",
    "that's": "that is",
    "there'd": "there had",
    "there'd've": "there would have",
    "there's": "there is",
    "they'd": "they would",
    "they'd've": "they would have",
    "they'll": "they will",
    "they'll've": "they will have",
    "they're": "they are",
    "they've": "they have",
    "to've": "to have",
    "wasn't": "was not",
    "we'd": "we had",
    "we'd've": "we would have",
    "we'll": "we will",
    "we'll've": "we will have",
    "we're": "we are",
    "we've": "we have",
    "weren't": "were not",
    "what'll": "what will",
    "what'll've": "what will have",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "when's": "when is",
    "when've": "when have",
    "where'd": "where did",
    "where's": "where is",
    "where've": "where have",
    "who'll": "who will",
    "who'll've": "who will have",
    "who's": "who is",
    "who've": "who have",
    "why's": "why is",
    "why've": "why have",
    "will've": "will have",
    "won't": "will not",
    "won't've": "will not have",
    "would've": "would have",
    "wouldn't": "would not",
    "wouldn't've": "would not have",
    "y'all": "you all",
    "y'alls": "you alls",
    "y'all'd": "you all would",
    "y'all'd've": "you all would have",
    "y'all're": "you all are",
    "y'all've": "you all have",
    "you'd": "you had",
    "you'd've": "you would have",
    "you'll": "you you will",
    "you'll've": "you you will have",
    "you're": "you are",
    "you've": "you have"
}

c_re = re.compile('(%s)' % '|'.join(cList.keys()), re.IGNORECASE)

def expandContractions(text, c_re=c_re):
    def replace(match):
        return cList[match.group(0).lower()]
    return c_re.sub(replace, text)



def detect_tense(sentence): 
    sentence = expandContractions(sentence.lower())
    tense = 'not_deter'
    index = -1
    POS = getPOS(sentence)

    if isPresentContinuous(POS):
        tense = 'present_continuous'
        index = isPresentContinuous(POS)[1]
    elif isFutureContinuous(POS):
        tense = 'future_continuous'
        index = isFutureContinuous(POS)[1]
    elif isPastContinuous(POS):
        tense = 'past_continuous'
        index = isPastContinuous(POS)[1]
    elif isPastPerfect(POS):
        tense = 'past_perfect'
        index = isPastPerfect(POS)[1]
    elif isPastPerfectContinuous(POS):
        tense = 'past_perfect_continuous'
        index = isPastPerfectContinuous(POS)[1]   
    elif isPastSimple(POS):
        tense = 'past_simple'
        index = isPastSimple(POS)[1]  
    elif isPresentPerfectContinuous(POS):
        tense = 'present_perfect_continuous'
        index = isPresentPerfectContinuous(POS)[1]
    elif isPresentPerfect(POS):
        tense = 'present_perfect'
        index = isPresentPerfect(POS)[1]
    elif isPresentSimple(POS):
        tense = 'present_simple'
        index = isPresentSimple(POS)[1]
    elif isFutureGoingTo(POS):
        tense = 'future_going_to'
        index = isFutureGoingTo(POS)[1]
    elif isFutureSimple(POS):
        tense = 'future_simple'
        index = isFutureSimple(POS)[1]
    else :
        tense = 'not_deter'

    return (tense, POS, index)
