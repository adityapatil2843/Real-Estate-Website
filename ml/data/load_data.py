import kagglehub
import pandas as pd
import os

path = kagglehub.dataset_download("amitabhajoy/bengaluru-house-price-data")

file_path = os.path.join(path, "bengaluru_house_data.csv")

df = pd.read_csv(file_path)
print(df.head())