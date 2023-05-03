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
    
df = pd.read_csv('dataset.csv')
category_id_df = df[['Level', 'level_id']].drop_duplicates().sort_values('level_id')
category_to_id = dict(category_id_df.values)
id_to_category = dict(category_id_df[['level_id', 'Level']].values)
grid = pickle.load(open("Model.sav", 'rb'))
X_train, X_test, y_train, y_test = \
    train_test_split(df[['Sentence','tense_id']], df['level_id'], test_size=0.25)
y_pred = grid.predict(X_test)

print("Accuracy " + str(np.mean(y_pred == y_test)))
conf_mat = confusion_matrix(y_test, y_pred)
fig, ax = plt.subplots(figsize=(10,10))
sns.heatmap(conf_mat, annot=True, fmt='d', xticklabels=category_id_df.Level.values, yticklabels=category_id_df.Level.values)
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.show()