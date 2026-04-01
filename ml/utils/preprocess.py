import pandas as pd

def preprocess(df):
    # Drop useless columns
    df = df.drop(['area_type', 'availability', 'society', 'balcony'], axis=1)

    # Handle missing values
    df = df.dropna()

    # Convert size (like "2 BHK" → 2)
    df['bhk'] = df['size'].apply(lambda x: int(x.split(' ')[0]))

    # Convert total_sqft
    def convert_sqft(x):
        try:
            return float(x)
        except:
            tokens = x.split('-')
            if len(tokens) == 2:
                return (float(tokens[0]) + float(tokens[1])) / 2
            return None

    df['total_sqft'] = df['total_sqft'].apply(convert_sqft)
    df = df.dropna()

    # Remove outliers (basic)
    df = df[df['total_sqft']/df['bhk'] > 300]

    return df