import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import time

print("Starting to fetch new, more detailed solar and weather data for multiple Indian cities...")
print("Using efficient batch CHUNKING with automatic retries to ensure reliability.")

# A comprehensive list of over 30 major Indian cities with coordinates
cities = {
    "Delhi": (28.70, 77.10), "Mumbai": (19.07, 72.87), "Kolkata": (22.57, 88.36),
    "Chennai": (13.08, 80.27), "Bengaluru": (12.97, 77.59), "Hyderabad": (17.38, 78.48),
    "Ahmedabad": (23.02, 72.57), "Pune": (18.52, 73.85), "Jaipur": (26.91, 75.78),
    "Lucknow": (26.84, 80.94), "Kanpur": (26.44, 80.33), "Nagpur": (21.14, 79.08),
    "Indore": (22.71, 75.85), "Thane": (19.21, 72.97), "Bhopal": (23.25, 77.41),
    "Visakhapatnam": (17.68, 83.21), "Patna": (25.59, 85.13), "Vadodara": (22.30, 73.18),
    "Ludhiana": (30.90, 75.85), "Agra": (27.17, 78.00), "Nashik": (19.99, 73.78),
    "Srinagar": (34.08, 74.79), "Amritsar": (31.63, 74.87), "Allahabad": (25.43, 81.84),
    "Guwahati": (26.14, 91.73), "Coimbatore": (11.01, 76.95), "Jabalpur": (23.18, 79.98),
    "Madurai": (9.92, 78.11), "Raipur": (21.25, 81.62), "Kota": (25.21, 75.86),
    "Chandigarh": (30.73, 76.77), "Leh": (34.15, 77.57), "Bhubaneswar": (20.29, 85.82)
}

# --- Implement the chunking strategy ---
def get_chunks(data, chunk_size):
    for i in range(0, len(data), chunk_size):
        yield data[i:i + chunk_size]

city_list = list(cities.items())
city_chunks = list(get_chunks(city_list, 8)) 

# Set end_date to two days ago for reliability
end_date_dt = datetime.now() - timedelta(days=2)
start_date_dt = end_date_dt - timedelta(days=3*365)
end_date = end_date_dt.strftime('%Y-%m-%d')
start_date = start_date_dt.strftime('%Y-%m-%d')

print(f"Fetching 3 years of data from {start_date} to {end_date} in {len(city_chunks)} chunks...")

all_city_data = []
api_url = "https://archive-api.open-meteo.com/v1/archive"

for i, chunk in enumerate(city_chunks):
    print(f"\n--- Processing Chunk {i+1}/{len(city_chunks)} ---")
    
    chunk_city_names = [city[0] for city in chunk]
    chunk_latitudes = [city[1][0] for city in chunk]
    chunk_longitudes = [city[1][1] for city in chunk]

    params = {
        "latitude": chunk_latitudes, "longitude": chunk_longitudes,
        "start_date": start_date, "end_date": end_date,
        "hourly": "temperature_2m,shortwave_radiation,relativehumidity_2m,cloudcover,windspeed_10m"
    }

    # --- Automatic retry logic ---
    retries = 3
    for attempt in range(retries):
        try:
            response = requests.get(api_url, params=params)
            response.raise_for_status() 
            results = response.json()

            # --- KEY CHANGE: Added a check for the number of results ---
            if len(results) != len(chunk_city_names):
                print(f"Warning: API returned {len(results)} results for a chunk of {len(chunk_city_names)} cities. Skipping this chunk to be safe.")
                continue

            for j, city_result in enumerate(results):
                city_name = chunk_city_names[j]
                if 'hourly' in city_result and city_result['hourly']['time']:
                    df = pd.DataFrame(city_result['hourly'])
                    df = df.rename(columns={
                        'time': 'DATE_TIME', 'temperature_2m': 'AMBIENT_TEMPERATURE', 'shortwave_radiation': 'IRRADIATION',
                        'relativehumidity_2m': 'HUMIDITY', 'cloudcover': 'CLOUD_COVER', 'windspeed_10m': 'WIND_SPEED'
                    })
                    df['CITY'] = city_name
                    all_city_data.append(df)
                    print(f"Successfully processed data for {city_name}.")
                else:
                    print(f"Warning: No data returned from API for {city_name}. Skipping.")
            
            break 
        
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429: 
                wait_time = (attempt + 1) * 10 
                print(f"Rate limit hit. Waiting for {wait_time} seconds before retrying...")
                time.sleep(wait_time)
            else:
                print(f"HTTP Error during chunk {i+1}: {e}")
                break 
        except Exception as e:
            print(f"An unexpected error occurred during chunk {i+1}: {e}")
            break

    if i < len(city_chunks) - 1:
        print("Waiting for 3 seconds before next chunk...")
        time.sleep(3)

if not all_city_data:
    print("\nFATAL ERROR: No data was collected for any city. Cannot proceed.")
    exit()

weather_df = pd.concat(all_city_data, ignore_index=True)
weather_df['IRRADIATION'] = weather_df.groupby('CITY')['IRRADIATION'].transform(lambda x: x.fillna(x.mean()))
weather_df['CLOUD_COVER'] = weather_df.groupby('CITY')['CLOUD_COVER'].transform(lambda x: x.fillna(x.mean()))
weather_df['WIND_SPEED'] = weather_df.groupby('CITY')['WIND_SPEED'].transform(lambda x: x.fillna(x.mean()))
weather_df['HUMIDITY'] = weather_df.groupby('CITY')['HUMIDITY'].transform(lambda x: x.fillna(x.mean()))
weather_df['AMBIENT_TEMPERATURE'] = weather_df.groupby('CITY')['AMBIENT_TEMPERATURE'].transform(lambda x: x.fillna(x.mean()))
weather_df.dropna(inplace=True)

print(f"\nData processing complete. Found data for {len(weather_df['CITY'].unique())} cities.")

# --- Simulate for multiple household system sizes ---
household_capacities_w = [3000.0, 4500.0, 5000.0]
all_system_data = []

for capacity in household_capacities_w:
    print(f"Simulating data for {capacity/1000} kW systems...")
    df_capacity = weather_df.copy()
    df_capacity['SYSTEM_CAPACITY_W'] = capacity
    df_capacity['IRRADIATION'] = df_capacity['IRRADIATION'] / 1000.0
    
    effective_irradiation = df_capacity['IRRADIATION'] * (1 - (df_capacity['CLOUD_COVER'] / 100) * 0.75)
    df_capacity['MODULE_TEMPERATURE'] = df_capacity['AMBIENT_TEMPERATURE'] + (effective_irradiation * 25) - (df_capacity['WIND_SPEED'] * 0.2)

    noise = 1 + (np.random.rand(len(df_capacity)) - 0.5) * 0.1
    df_capacity['DC_POWER'] = (effective_irradiation * capacity) * (1 - (df_capacity['MODULE_TEMPERATURE'] - 25) * 0.004) * noise
    df_capacity['DC_POWER'] = df_capacity['DC_POWER'].clip(lower=0)
    
    all_system_data.append(df_capacity)

final_df = pd.concat(all_system_data, ignore_index=True)
final_df = final_df.dropna()

output_filename = 'India_Household_Solar_Data_Multi_Size.csv'
final_df.to_csv(output_filename, index=False)
print(f"\nSuccessfully saved new, multi-size household data to '{output_filename}' with {len(final_df)} total records.")

