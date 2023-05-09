import pandas as pd
import os
dir_path = os.path.dirname(os.path.realpath(__file__))

def verbForms(verb):    
    df = pd.read_csv(os.path.join(dir_path, 'most-common-verbs-english.csv'))
    row = df[df['Word'].eq(verb)]
    if (row.empty): 
        return []
    return row.iloc[0,0:].values


if __name__  == '__main__':
    print(verbForms('be'))