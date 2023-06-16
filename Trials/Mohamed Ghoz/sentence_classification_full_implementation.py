import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
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
from sklearn.ensemble import RandomForestClassifier



def count_syllables(word):
    syllable_count = 0
    vowels = 'aeiouy'
    if word[0] in vowels:
        syllable_count += 1
    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            syllable_count += 1
    if word.endswith('e'):
        syllable_count -= 1
    if word.endswith('le') and len(word) > 2 and word[-3] not in vowels:
        syllable_count += 1
    if syllable_count == 0:
        syllable_count += 1
    return syllable_count

def calculate_syllables(sentence, which):
    num_1to3 = 0
    num_4ormore = 0
    sentence = sentence.split(" ")
    for word in sentence:
        num = count_syllables(word)
        if num > 3:
            num_4ormore += 1
        else:
            num_1to3 +=1
    if (which == 1):
        return num_1to3
    elif(which == 2):
        return num_4ormore

def avg_syllables(sentence):
    count = 0
    num = 0
    sentence = sentence.split(" ")
    for word in sentence:
        num += count_syllables(word)
        count += 1
    return num/count

def avg_word_len(sentence):
    count = 0
    num = 0
    sentence = sentence.split(" ")
    for word in sentence:
        num += len(word)
        count += 1
    return num/count


df = pd.read_csv('dataset2.csv')


columns = {"syllables 3":[],
           "syllables 4": [],
           "syllables avg": [],
           "word length avg": [],
           "sentence length":[]
           }
for value in df.itertuples():
    columns["syllables 3"].append(calculate_syllables(value.Sentence, 1))
    columns["syllables 4"].append(calculate_syllables(value.Sentence, 2))
    columns["syllables avg"].append(avg_syllables(value.Sentence))
    columns["word length avg"].append(avg_word_len(value.Sentence))
    columns["sentence length"].append(len(value.Sentence.split(" ")))

newDF = pd.DataFrame(columns)
df = df.join(newDF)

tfidf = TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')
features = tfidf.fit_transform(df.Sentence).toarray()
labels = df.level_id
features.shape




category_id_df = df[['Level', 'level_id']].drop_duplicates().sort_values('level_id')
category_to_id = dict(category_id_df.values)
id_to_category = dict(category_id_df[['level_id', 'Level']].values)

  
X_train, X_test, y_train, y_test = train_test_split(df['Sentence'], df['Level'], random_state = 0)
count_vect = CountVectorizer()
X_train_counts = count_vect.fit_transform(X_train)
tfidf_transformer = TfidfTransformer()
X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
clf = MultinomialNB().fit(X_train_tfidf, y_train)
prediction = clf.predict(count_vect.transform(["The management team were held to blame for the failure."]))
print(prediction)


class ColumnSelector(BaseEstimator, TransformerMixin):

    def __init__(self, name=None, position=None,
                 as_cat_codes=False, sparse=False, reshape=False):
        self.name = name
        self.position = position
        self.as_cat_codes = as_cat_codes
        self.sparse = sparse
        self.reshape = reshape
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
        if self.reshape:
            ret = ret.values.reshape(-1,1)
        return ret

union = FeatureUnion([
            ('text', 
             Pipeline([
                ('select', ColumnSelector('Sentence')),
                #('pct', SelectPercentile(percentile=1)),
                ('vect', TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')),
             ]) ),
            ('ads',
             Pipeline([
                ('select', ColumnSelector('tense_id', sparse=False,reshape=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
                #('encode', OneHotEncoder(handle_unknown='ignore'))
             ]) ),
            ('syllables3',
             Pipeline([
                ('select', ColumnSelector('syllables 3', sparse=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
                #('encode', OneHotEncoder(handle_unknown='ignore'))
             ]) ),
            ('syllables4',
             Pipeline([
                ('select', ColumnSelector('syllables 4', sparse=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
                #('encode', OneHotEncoder(handle_unknown='ignore'))
             ]) ),
             ('syllables_avg',
             Pipeline([
                ('select', ColumnSelector('syllables avg', sparse=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
                #('encode', OneHotEncoder(handle_unknown='ignore'))
             ]) ),
             ('wordLenAvg',
             Pipeline([
                ('select', ColumnSelector('word length avg', sparse=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
                #('encode', OneHotEncoder(handle_unknown='ignore'))
             ]) ),
            ('sentenceLen',
             Pipeline([
                ('select', ColumnSelector('sentence length', sparse=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
                #('encode', OneHotEncoder(handle_unknown='ignore'))
             ]) )
        ])

pipe = Pipeline([
    ('union', union),
    ('clf',  RandomForestClassifier(n_estimators= 10000, criterion="entropy"))
])

param_grid = [
    # {
    #     'union__text__vect': [TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')],
    #     'clf': [SGDClassifier(max_iter=500)],
    #     'union__text__vect__ngram_range': [(1,1), (2,5)],
    #     'union__text__vect__analyzer': ['word','char_wb'],
    #     'clf__alpha': np.logspace(-5, 0, 6),
    #     #'clf__max_iter': [500],
    # },
    {
        'union__text__vect': [TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', stop_words='english')],
        'clf': [ RandomForestClassifier(n_estimators= 10000, criterion="entropy")],
        'union__text__vect__ngram_range': [(1,2), (2,5)],
        'union__text__vect__analyzer': ['char_wb'],
        # 'clf__alpha': [0.002],
    },
    #{        # NOTE: does NOT support sparse matrices!
    #    'union__text__vect': [TfidfVectorizer(sublinear_tf=True,
    #                                          max_df=0.5,
    #                                          stop_words='english')],
    #    'clf': [GaussianNB()],
    #    'union__text__vect__ngram_range': [(1,1), (2,5)],
    #    'union__text__vect__analyzer': ['word','char_wb'],
    #},
]

gs_kwargs = dict(cv=3, n_jobs=1, verbose=2)
X_train, X_test, y_train, y_test = \
    train_test_split(df[['Sentence','tense_id','syllables 3','syllables 4','syllables avg','word length avg','sentence length']], df['level_id'], test_size=0.25)
grid = GridSearchCV(pipe, param_grid=param_grid, **gs_kwargs)
grid.fit(X_train, y_train)

# prediction
# example = pd.DataFrame([["The management team were held to blame for the failure.",22]],columns=["Sentence","tense_id"])
# predicted = grid.predict(example)
# print(predicted[0])

y_pred = grid.predict(X_test)

print("Accuracy " + str(np.mean(y_pred == y_test)))
conf_mat = confusion_matrix(y_test, y_pred)
fig, ax = plt.subplots(figsize=(10,10))
sns.heatmap(conf_mat, annot=True, fmt='d', xticklabels=category_id_df.Level.values, yticklabels=category_id_df.Level.values)
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.show()

pickle.dump(grid, open("Model.sav", "wb"))






        