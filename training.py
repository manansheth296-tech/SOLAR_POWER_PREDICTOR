import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor 
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
from datetime import datetime

# This script will now save the model files in the same folder it is run from.

print("Starting model training process with the comprehensive, multi-size household dataset...")

try:
    df = pd.read_csv('India_Household_Solar_Data_Multi_Size.csv')
    print(f"Successfully loaded '{df.shape[0]}' records from 'India_Household_Solar_Data_Multi_Size.csv'.")
except FileNotFoundError:
    print("Error: 'India_Household_Solar_Data_Multi_Size.csv' not found.")
    print("Please ensure the CSV file is in the same folder as this script.")
    exit()

df['DATE_TIME'] = pd.to_datetime(df['DATE_TIME'])
start_date = df['DATE_TIME'].min().strftime('%Y-%m-%d')
end_date = df['DATE_TIME'].max().strftime('%Y-%m-%d')

df = pd.get_dummies(df, columns=['CITY'], prefix='CITY', dtype=int)
print(f"Successfully converted the CITY column into numerical features.")

weather_features = [
    'AMBIENT_TEMPERATURE', 'IRRADIATION', 'MODULE_TEMPERATURE', 
    'HUMIDITY', 'CLOUD_COVER', 'WIND_SPEED'
]
system_features = ['SYSTEM_CAPACITY_W']
city_features = [col for col in df.columns if col.startswith('CITY_')]
feature_columns = weather_features + system_features + city_features
target_column = 'DC_POWER'

X = df[feature_columns].copy()
y = df[target_column].copy()
X.fillna(X.mean(), inplace=True)
y.fillna(y.mean(), inplace=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Data splitting complete.")

print("Training the final model using the advanced RandomForestRegressor...")
model = RandomForestRegressor(n_estimators=20, random_state=42, n_jobs=-1, verbose=1)
model.fit(X_train, y_train)
print("Model training complete!")

print("\n--- Model Performance Evaluation ---")
y_pred = model.predict(X_test)

r2 = r2_score(y_test, y_pred)
print(f"✅ R-squared (R²) Score: {r2:.4f}")
print(f"   (This means our model explains {r2:.2%} of the variance in the power output.)")

mae = mean_absolute_error(y_test, y_pred)
print(f"✅ Mean Absolute Error (MAE): {mae:.2f} Watts")
print(f"   (On average, the model's prediction is off by approximately {mae:.2f} Watts.)")
print("------------------------------------\n")


model_filename = 'solar_model_india.joblib'
joblib.dump(model, model_filename)
print(f"Model saved successfully as '{model_filename}'")

metadata_filename = 'model_metadata_india.joblib'
model_metadata = {
    "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "data_start_date": start_date,
    "data_end_date": end_date,
    "cities": [city.replace('CITY_', '') for city in city_features],
    "r2_score": r2,
    "mae_watts": mae
}
joblib.dump(model_metadata, metadata_filename)
print(f"Model metadata saved successfully as '{metadata_filename}'")

