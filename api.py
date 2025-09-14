from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

# --- Load the pre-trained model and metadata ---
# Make sure to run 'training.py' first to generate these files.
if not os.path.exists('solar_model_india.joblib') or not os.path.exists('model_metadata_india.joblib'):
    raise FileNotFoundError("Model files not found. Please run 'training.py' first.")

model = joblib.load('solar_model_india.joblib')
metadata = joblib.load('model_metadata_india.joblib')
trained_cities = metadata['cities']
feature_order = ['AMBIENT_TEMPERATURE', 'IRRADIATION', 'MODULE_TEMPERATURE', 'HUMIDITY', 'CLOUD_COVER', 'WIND_SPEED', 'SYSTEM_CAPACITY_W'] + [f'CITY_{c}' for c in sorted(trained_cities)]

# --- Initialize FastAPI App ---
app = FastAPI(
    title="SunSight AI: Solar Power Prediction API",
    description="API to predict solar power output using a pre-trained machine learning model."
)

# --- Add CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:5173", # This is the typical port for Vite development server
    "http://127.0.0.1",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic model for request body validation ---
class PredictionRequest(BaseModel):
    city: str
    ambient_temp: float
    irradiation: float
    humidity: int
    cloud_cover: int
    wind_speed: int
    system_capacity: float

# --- Prediction Endpoint ---
@app.post("/predict")
async def predict_solar_power(request: PredictionRequest):
    """
    Takes user inputs and returns a solar power prediction.
    """
    try:
        # Calculate module temperature
        module_temp = request.ambient_temp + (request.irradiation * 25) - (request.wind_speed * 0.2)
        
        # Prepare the input data for the model
        input_data = {
            'AMBIENT_TEMPERATURE': [request.ambient_temp],
            'IRRADIATION': [request.irradiation],
            'MODULE_TEMPERATURE': [module_temp],
            'HUMIDITY': [request.humidity],
            'CLOUD_COVER': [request.cloud_cover],
            'WIND_SPEED': [request.wind_speed],
            'SYSTEM_CAPACITY_W': [request.system_capacity * 1000]
        }
        
        # Add one-hot encoded city features, ensuring all cities are present
        for city in trained_cities:
            input_data[f'CITY_{city}'] = [0]
        if f'CITY_{request.city}' in input_data:
            input_data[f'CITY_{request.city}'] = [1]
        
        input_df = pd.DataFrame(input_data)
        input_df = input_df[feature_order]

        # Get the prediction from the model
        predicted_watts = max(0, model.predict(input_df)[0])
        final_prediction_kw = predicted_watts / 1000.0

        return {
            "predicted_power_kw": final_prediction_kw,
            "message": "Prediction successful"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
