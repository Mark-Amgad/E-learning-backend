import sys
from TorFQ import generateTFQ
from MCQQ import generateMCQQ
import json
from tense_detector import detect_tense

if __name__ == '__main__':

    print(sys.argv)

    if(len(sys.argv) < 3):
        sys.exit('Should sent 3 arguments')

    sentence = sys.argv[2]
    questionType = sys.argv[1]
    detectedTense = detect_tense(sentence)
    question = dict()
    match questionType:
        case 'TorFQ':
            question = generateTFQ(sentence, detectedTense)
        case 'MCQQ':
            question = generateMCQQ(sentence, detectedTense)
        case _:
            sys.exit('Not supported type of question')

    if not question:
        sys.exit('Failed to generate question')
    else:
        print(json.dumps(question))