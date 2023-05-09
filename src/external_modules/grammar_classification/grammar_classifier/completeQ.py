
from tense_detector import detect_tense
import re


def generateCompleteQuestion(sentence, tenseClassified):
    tense, POS, verbIndex = tenseClassified
    quesitonDict = dict()
    replacable = f'({POS[verbIndex].lemma})'
    question = re.sub(f'{POS[verbIndex].text}', replacable, sentence)
    question = re.sub('been|being',  '', question)
    quesitonDict['tense'] = tense
    quesitonDict['original'] = sentence
    quesitonDict['question'] = question

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
        question = generateCompleteQuestion(sen, tenseData)
        print(question)
