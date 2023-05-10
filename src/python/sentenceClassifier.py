import pandas as pd
import numpy as np
# import matplotlib.pyplot as plt
# import seaborn as sns
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline, FeatureUnion
from scipy.sparse import csr_matrix
from sklearn.metrics import confusion_matrix
import nltk
from nltk import word_tokenize, pos_tag
import sys
import os
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

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


class ColumnSelector(BaseEstimator, TransformerMixin):

    def __init__(self, name=None, position=None,
                 as_cat_codes=False, sparse=False):
        self.name = name
        self.position = position
        self.as_cat_codes = as_cat_codes
        self.sparse = sparse

    def fit(self, X, y=None):
        return self

    def transform(self, X, **kwargs):
        if self.name is not None:
            col_pos = X.columns.get_loc(self.name)
        elif self.position is not None:
            col_pos = self.position
        else:
            raise Exception('either [name] or [position] parameter must be not-None')
        if self.as_cat_codes and X.dtypes.iloc[col_pos] == 'category':
                ret = X.iloc[:, col_pos].cat.codes
        else:
            ret = X.iloc[:, col_pos]
        if self.sparse:
            ret = csr_matrix(ret.values.reshape(-1,1))
        return ret
    
full_path = os.path.realpath(__file__)
df = pd.read_csv(os.path.dirname(full_path)+'\dataset.csv')
category_id_df = df[['Level', 'level_id']].drop_duplicates().sort_values('level_id')
category_to_id = dict(category_id_df.values)
id_to_category = dict(category_id_df[['level_id', 'Level']].values)
grid = pickle.load(open(os.path.dirname(full_path)+"\Model.sav", 'rb'))
X_train, X_test, y_train, y_test = \
    train_test_split(df[['Sentence','tense_id']], df['level_id'], test_size=0.25)
y_pred = grid.predict(X_test)

# print("Accuracy " + str(np.mean(y_pred == y_test)))
# conf_mat = confusion_matrix(y_test, y_pred)
# fig, ax = plt.subplots(figsize=(10,10))
# sns.heatmap(conf_mat, annot=True, fmt='d', xticklabels=category_id_df.Level.values, yticklabels=category_id_df.Level.values)
# plt.ylabel('Actual')
# plt.xlabel('Predicted')
# plt.show()

sentence = sys.argv[1]
tenses = tense_detect(sentence)
mapping = { 
    'future perfect continuous passive':     0,
    'future perfect continuous':             1,
    'future continuous passive':             2,
    'future continuous':                     3,
    'future perfect passive':                4,
    'future perfect':                        5,
    'future simple passive':                 6,
    'future simple':                         7,
    'present perfect continuous passive':    8,
    'present perfect continuous':            9,
    'present continuous passive':            10,
    'present continuous':                    11,
    'present perfect passive':               12,
    'present perfect':                       13,
    'present simple passive':                14,
    'present simple':                        15,
    'past perfect continuous passive':       16,
    'past perfect continuous':               17,
    'past continuous passive':               18,
    'past continuous':                       19,
    'past perfect passive':                  20,
    'past perfect':                          21,
    'past simple passive':                   22,
    'past simple':                           23
}
tense = tuple(tenses)
tense_string = "["
for t in tense:
    tense_string += '"' + t + '"'
    tense_string += ","
tense_string = tense_string[0:-1]
tense_string += "]"
id = mapping[tense[0]]
example = pd.DataFrame([[sentence,id]],columns=["Sentence","tense_id"])
predicted = grid.predict(example)
print(id_to_category[predicted[0]] + "+" + tense_string)
