from tense_detector import detect_tense
import re
from verbFroms import verbForms
import numpy as np

def generateMCQQ(sentence, tenseClassified):
    tense, POS, verbIndex = tenseClassified
    quesitonDict = dict()
    replacable = POS[verbIndex].lemma
    question = re.sub(f'{POS[verbIndex].text}', f'({replacable})', sentence)
    removedWord = POS[verbIndex].text
    if (POS[verbIndex - 1].text in ['been', 'being']):
        question = re.sub('been|being',  '', question)
        removedWord = POS[verbIndex - 1].text + " " + removedWord
    mcqOptions = np.append(verbForms(replacable), [removedWord, replacable])
    mcqOptions = np.unique(mcqOptions)

    if(not len(mcqOptions)):
        return quesitonDict
    
    quesitonDict['mcq'] = mcqOptions.tolist()
    quesitonDict['answer'] = removedWord
    quesitonDict['question'] = f'{question} ――――― Substitute the verb between brackets so the sentence is in the "{tense}" tense'

    return quesitonDict



if __name__ == '__main__':

    examples = [
        'I saw him two weeks ago.',
        'He is not gossiping with his friends now.',
        'She had lived in Liverpool all her life.',
        'Martha had been walking three miles a day before she broke her leg',
        'Mary has been feeling a little depressed.'
    ]

    for sen in examples:
        tenseData = detect_tense(sen)
        question = generateMCQQ(sen, tenseData)
        print(question)
