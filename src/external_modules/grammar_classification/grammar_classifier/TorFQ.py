
from tense_detector import detect_tense
import re
import random

firstPart = [
    'present', 'past', 'future'
]

secondPart = [
    'simple', 'perfect', 'continuous', 'perfect_continuous'
]

def chooseRandomTense(tense):
    tenseParts = tense.split('_')
    
    randomInt = random.randint(0, 1)

    parts = []
    if randomInt == 0:
        parts = [firstPart[random.randint(0, len(firstPart) - 1)]] + tenseParts[1:]
    else :
        parts = [firstPart[0], secondPart[random.randint(0, len(secondPart) - 1)]]
    return '_'.join(parts)


def generateTFQ(sentence, tenseClassified):
    tense, POS, verbIndex = tenseClassified
    randomTense = chooseRandomTense(tense)
    quesitonDict = dict()
    quesitonDict['question'] = f'{sentence} - Is the previous sentence in the "{randomTense}" tense?'
    quesitonDict['answer'] = 'True' if (randomTense == tense) else 'False'
    quesitonDict['mcq'] = ['True', 'False']

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
        question = generateTFQ(sen, tenseData)
        print(question)
