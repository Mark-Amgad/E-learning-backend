import nltk
from nltk import word_tokenize, pos_tag


def tense_detect(sentence):
    text = word_tokenize(sentence)
    tagged_sentence = pos_tag(text)
    verb_tags = ['MD','MDF',
                 'VB','VBP','VBG','VBN','VBD','VBZ',
                 ]
        
    verb_phrase = []
    for item in tagged_sentence:
        if item[1] in verb_tags:
            verb_phrase.append(item)
    
    grammar = r'''
            future perfect continuous passive:     {<MD><VB><VBN><VBG><VBN>}
            future perfect continuous:             {<MD><VB><VBN><VBG>}
            future continuous passive:             {<MD><VB><VBG><VBN>}
            future continuous:                     {<MD><VB><VBG>}
            future perfect passive:                {<MD><VB><VBN><VBN>}
            future perfect:                        {<MD><VB><VBN>}
            future simple passive:                 {<MD><VB><VBN>}
            future simple:                         {<MD><VB>}
            present perfect continuous passive:    {<VBP|VBZ><VBN><VBG><VBN>}
            present perfect continuous:            {<VBP|VBZ><VBN><VBG>}
            present continuous passive:            {<VBZ|VBP><VBG><VBN>}
            present continuous:                    {<VBZ|VBP><VBG>}
            present perfect passive:               {<VBZ|VBP><VBN><VBN>}
            present perfect:                       {<VBZ|VBP><VBN>}
            present simple passive:                {<VBZ|VBP><VBN>}
            present simple:                        {<VB|VBZ|VBP|VBG|MD>}
            past perfect continuous passive:       {<VBD><VBN><VBG><VBN>}
            past perfect continuous:               {<VBD><VBN><VBG>}
            past continuous passive:               {<VBZ|VBP><VBG><VBN>}
            past continuous:                       {<VBZ|VBP><VBG>}
            past perfect passive:                  {<VBD><VBN><VBN>}
            past perfect:                          {<VBD><VBN>}
            past simple passive:                   {<VBD><VBN>}
            past simple:                           {<VBD|VBN>}
            '''
    
    cp = nltk.RegexpParser(grammar)
    if len(verb_phrase) == 0:
        return {"present simple"}
    result = cp.parse(verb_phrase)               
    tenses_set = set()
    for node in result:
        if type(node) is nltk.tree.Tree:
            entry = node.label()
            i = 0
            if node[0][1] == "MD":
                i = 1
            if "perfect" in entry and not(node[i][0] == 'have' or node[i][0] == 'has' or node[i][0] == 'had' or node[i][0] == "\'ve" or node[i][0] == "\'s" or node[i][0] == "\'d"):
                if "future" in entry:
                    entry = "future simple passive"
                elif "present" in entry:
                    entry = "present simple passive"
                elif "past" in entry:
                    entry = "past simple passive"
            tenses_set.add(entry)
    return tenses_set

print(tense_detect("The management team were held to blame for the failure."))
# file = open("dataset.csv")
# output = open("sentences_tenses.csv","w")
# output.write("first, second \n")
# i = 1
# for line in file:
#     sen = line.split(",")
#     t_set = tense_detect(sen[1])
#     if len(t_set) != 0:
#         if i != 1:
#             output.write(sen[1] + "," + t_set.pop() + "\n")
#     else:
#         print(i)
#     i += 1