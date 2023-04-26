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


df = pd.read_csv('dataset.csv')

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

union = FeatureUnion([
            ('text', 
             Pipeline([
                ('select', ColumnSelector('Sentence')),
                #('pct', SelectPercentile(percentile=1)),
                ('vect', TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')),
             ]) ),
            ('ads',
             Pipeline([
                ('select', ColumnSelector('tense_id', sparse=True,
                                          as_cat_codes=True)),
                #('scale', StandardScaler(with_mean=False)),
             ]) )
        ])

pipe = Pipeline([
    ('union', union),
    ('clf', MultinomialNB())
])

param_grid = [
    {
        'union__text__vect': [TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')],
        'clf': [SGDClassifier(max_iter=500)],
        'union__text__vect__ngram_range': [(1,1), (2,5)],
        'union__text__vect__analyzer': ['word','char_wb'],
        'clf__alpha': np.logspace(-5, 0, 6),
        #'clf__max_iter': [500],
    },
    {
        'union__text__vect': [TfidfVectorizer(sublinear_tf=True, min_df=1, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')],
        'clf': [MultinomialNB()],
        'union__text__vect__ngram_range': [(1,1), (2,5)],
        'union__text__vect__analyzer': ['word','char_wb'],
        'clf__alpha': np.logspace(-4, 2, 7),
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
    train_test_split(df[['Sentence','tense_id']], df['level_id'], test_size=0.25)
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