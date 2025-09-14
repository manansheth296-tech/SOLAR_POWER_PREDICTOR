import streamlit as st
import pandas as pd
import joblib
import datetime
import requests
import numpy as np
import plotly.graph_objects as go
# --- KEY CHANGE: Import the correct function name ---
from streamlit_geolocation import streamlit_geolocation
import math

# --- Page Configuration ---
st.set_page_config(
    page_title="SunSight AI: Solar Power Predictor",
    page_icon="☀️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- Page Navigation Logic ---
if 'page' not in st.session_state:
    st.session_state.page = 'input'

def switch_page(page_name):
    st.session_state.page = page_name

# --- Enhanced Custom CSS for a Sleek Dark Theme ---
css = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --primary-color: #f9fafb; /* Light gray for main text */
    --secondary-color: #818cf8; /* Lighter purple for accents */
    --accent-color: #f59e0b;
    --bg-color: #111827; /* Dark charcoal background */
    --card-bg: rgba(31, 41, 55, 0.8); /* Dark, semi-transparent card */
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db; /* Lighter gray for subtitles */
    --border-color: #4b5563;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

body {
    font-family: 'Inter', sans-serif;
}

.stApp {
    background-color: var(--bg-color);
}

.main .block-container {
    padding: 2rem 1rem;
    max-width: 1200px;
}

.main-header {
    text-align: center;
    margin-bottom: 3rem;
}

.main-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
}

.subtitle {
    color: var(--text-secondary);
    font-size: 1.2rem;
}

.glass-card {
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
}

.glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

div[data-testid="stMetric"] {
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: white;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    border: none;
    box-shadow: var(--shadow);
}

div[data-testid="stMetric"] label {
    color: rgba(255, 255, 255, 0.8) !important;
    font-weight: 500 !important;
}

div[data-testid="stMetric"] div {
    color: white !important;
    font-weight: 700 !important;
}

.stButton > button {
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    width: 100%;
}

.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(129, 140, 248, 0.3);
    background: #a855f7;
}

.section-header {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent-color);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}

/* Dark mode adjustments for inputs */
.stTextInput > div > div > input,
.stNumberInput > div > div > input {
    background-color: #374151;
    color: var(--text-primary);
    border-color: var(--border-color);
}

.stSelectbox > div {
    background-color: #374151;
    border-color: var(--border-color);
    color: var(--text-primary);
}
</style>
"""
st.markdown(css, unsafe_allow_html=True)

# --- Load Model & Metadata ---
@st.cache_resource
def load_model_and_metadata():
    try:
        model = joblib.load('solar_model_india.joblib')
        metadata = joblib.load('model_metadata_india.joblib')
        return model, metadata
    except FileNotFoundError:
        return None, None

model, metadata = load_model_and_metadata()

if not model or not metadata:
    st.error("🚨 Model Not Found. Please run 'training.py' to generate the model files.")
    st.stop()

trained_cities = metadata['cities']
city_details = {
    "Delhi": {"lat": 28.70, "lon": 77.10, "tilt": 28, "state": "Delhi"},
    "Mumbai": {"lat": 19.07, "lon": 72.87, "tilt": 19, "state": "Maharashtra"},
    "Kolkata": {"lat": 22.57, "lon": 88.36, "tilt": 22, "state": "West Bengal"},
    "Chennai": {"lat": 13.08, "lon": 80.27, "tilt": 13, "state": "Tamil Nadu"},
    "Bengaluru": {"lat": 12.97, "lon": 77.59, "tilt": 13, "state": "Karnataka"},
    "Hyderabad": {"lat": 17.38, "lon": 78.48, "tilt": 17, "state": "Telangana"},
    "Ahmedabad": {"lat": 23.02, "lon": 72.57, "tilt": 23, "state": "Gujarat"},
    "Pune": {"lat": 18.52, "lon": 73.85, "tilt": 18, "state": "Maharashtra"},
    "Jaipur": {"lat": 26.91, "lon": 75.78, "tilt": 27, "state": "Rajasthan"},
    "Lucknow": {"lat": 26.84, "lon": 80.94, "tilt": 27, "state": "Uttar Pradesh"},
    "Kanpur": {"lat": 26.44, "lon": 80.33, "tilt": 26, "state": "Uttar Pradesh"},
    "Nagpur": {"lat": 21.14, "lon": 79.08, "tilt": 21, "state": "Maharashtra"},
    "Indore": {"lat": 22.71, "lon": 75.85, "tilt": 23, "state": "Madhya Pradesh"},
    "Thane": {"lat": 19.21, "lon": 72.97, "tilt": 19, "state": "Maharashtra"},
    "Bhopal": {"lat": 23.25, "lon": 77.41, "tilt": 23, "state": "Madhya Pradesh"},
    "Visakhapatnam": {"lat": 17.68, "lon": 83.21, "tilt": 18, "state": "Andhra Pradesh"},
    "Patna": {"lat": 25.59, "lon": 85.13, "tilt": 26, "state": "Bihar"},
    "Vadodara": {"lat": 22.30, "lon": 73.18, "tilt": 22, "state": "Gujarat"},
    "Ludhiana": {"lat": 30.90, "lon": 75.85, "tilt": 31, "state": "Punjab"},
    "Agra": {"lat": 27.17, "lon": 78.00, "tilt": 27, "state": "Uttar Pradesh"},
    "Nashik": {"lat": 19.99, "lon": 73.78, "tilt": 20, "state": "Maharashtra"},
    "Srinagar": {"lat": 34.08, "lon": 74.79, "tilt": 34, "state": "Jammu & Kashmir"},
    "Amritsar": {"lat": 31.63, "lon": 74.87, "tilt": 32, "state": "Punjab"},
    "Allahabad": {"lat": 25.43, "lon": 81.84, "tilt": 25, "state": "Uttar Pradesh"},
    "Guwahati": {"lat": 26.14, "lon": 91.73, "tilt": 26, "state": "Assam"},
    "Coimbatore": {"lat": 11.01, "lon": 76.95, "tilt": 11, "state": "Tamil Nadu"},
    "Jabalpur": {"lat": 23.18, "lon": 79.98, "tilt": 23, "state": "Madhya Pradesh"},
    "Madurai": {"lat": 9.92, "lon": 78.11, "tilt": 10, "state": "Tamil Nadu"},
    "Raipur": {"lat": 21.25, "lon": 81.62, "tilt": 21, "state": "Chhattisgarh"},
    "Kota": {"lat": 25.21, "lon": 75.86, "tilt": 25, "state": "Rajasthan"},
    "Chandigarh": {"lat": 30.73, "lon": 76.77, "tilt": 31, "state": "Chandigarh"},
    "Leh": {"lat": 34.15, "lon": 77.57, "tilt": 34, "state": "Ladakh"},
    "Bhubaneswar": {"lat": 20.29, "lon": 85.82, "tilt": 20, "state": "Odisha"}
}

# --- Helper: GPS → Nearest Trained City ---
def find_nearest_city(lat, lon, city_details):
    nearest_city, min_dist = None, float("inf")
    for city, info in city_details.items():
        d = math.sqrt((lat - info["lat"])**2 + (lon - info["lon"])**2)
        if d < min_dist:
            min_dist = d
            nearest_city = city
    return nearest_city

# --- Main App Logic ---
# =====================================================================================
# INPUT PAGE
# =====================================================================================
if st.session_state.page == 'input':
    st.markdown('<div class="main-header fade-in-up"><h1 class="main-title">☀️ SunSight AI</h1><p class="subtitle">Enter your system details to get an AI-powered solar power prediction.</p></div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2, gap="large")

    # --- Auto-Detect with GPS Card (YOUR NEW LOGIC) ---
    with col1:
        with st.container():
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)
            st.markdown('<h2 class="section-header">📍 Auto-Detect (Recommended)</h2>', unsafe_allow_html=True)
            st.write("Uses your device GPS to get the most accurate, real-time prediction based on live weather data.")
            st.markdown("<br>", unsafe_allow_html=True)

            system_capacity_auto = st.number_input(
                "Enter Your System Capacity (kW)",
                min_value=1.0,
                max_value=100.0,
                value=5.0,
                step=0.5,
                key="auto_capacity"
            )

            if st.button("🛰️ Use Current Location & Predict", type="primary"):
                # --- KEY CHANGE: Call the correct function name ---
                loc = streamlit_geolocation()
                
                # --- FIX: Add a more robust check to ensure lat/lon are not None ---
                if (loc and "latitude" in loc and "longitude" in loc and loc["latitude"] is not None and loc["longitude"] is not None):
                    lat, lon = loc["latitude"], loc["longitude"]
                    nearest_city = find_nearest_city(lat, lon, city_details)
                    
                    with st.spinner(f"Fetching live weather for {nearest_city} (Lat {lat:.2f}, Lon {lon:.2f})..."):
                        api_url = (
                            f"https://api.open-meteo.com/v1/forecast?"
                            f"latitude={lat}&longitude={lon}"
                            "&current=temperature_2m,shortwave_radiation,relative_humidity_2m,cloud_cover,wind_speed"
                        )
                        try:
                            response = requests.get(api_url).json()['current']
                            st.session_state.inputs = {
                                'city': nearest_city,
                                'ambient_temp': response['temperature_2m'],
                                'irradiation': response['shortwave_radiation'] / 1000.0,
                                'humidity': response['relative_humidity_2m'],
                                'cloud_cover': response['cloud_cover'],
                                'wind_speed': response['wind_speed'],
                                'system_capacity': system_capacity_auto,
                                'lat': lat,
                                'lon': lon
                            }
                            switch_page('results')
                        except Exception as e:
                            st.error(f"❌ Failed to fetch weather data. Details: {e}")
                else:
                    st.warning("⚠️ Could not fetch your location. Please allow location access or use manual configuration.")
            
            st.markdown('</div>', unsafe_allow_html=True)

    # --- Manual Configuration Card ---
    with col2:
        with st.container():
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)
            st.markdown('<h2 class="section-header">⚙️ Manual Configuration</h2>', unsafe_allow_html=True)
            st.write("Manually enter all parameters for a custom or hypothetical prediction.")
            
            selected_city = st.selectbox("Select City", options=sorted(trained_cities))
            system_capacity_manual = st.number_input("System Capacity (kW)", 1.0, 100.0, 5.0, 0.5, key="manual_capacity")
            ambient_temp = st.number_input("Ambient Temperature (°C)", -20.0, 55.0, 28.0, 0.1)
            irradiation = st.number_input("Solar Irradiation (kW/m²)", 0.0, 1.5, 0.75, 0.01)
            humidity = st.slider("Humidity (%)", 0, 100, 60)
            cloud_cover = st.slider("Cloud Cover (%)", 0, 100, 40)
            wind_speed = st.slider("Wind Speed (km/h)", 0, 50, 10)
            
            if st.button("📊 Generate Prediction"):
                st.session_state.inputs = {
                    'city': selected_city,
                    'system_capacity': system_capacity_manual,
                    'ambient_temp': ambient_temp,
                    'irradiation': irradiation,
                    'humidity': humidity,
                    'cloud_cover': cloud_cover,
                    'wind_speed': wind_speed
                }
                switch_page('results')

            st.markdown('</div>', unsafe_allow_html=True)

# =====================================================================================
# RESULTS PAGE
# =====================================================================================
elif st.session_state.page == 'results' and 'inputs' in st.session_state:
    inputs = st.session_state.inputs
    selected_city = inputs['city']
    system_capacity = inputs['system_capacity']
    ambient_temp = inputs['ambient_temp']
    irradiation = inputs['irradiation']
    humidity = inputs['humidity']
    cloud_cover = inputs['cloud_cover']
    wind_speed = inputs['wind_speed']
    city_info = city_details.get(selected_city, {})

    st.markdown(f'<div class="main-header fade-in-up"><h1 class="main-title">☀️ Prediction for {selected_city}</h1></div>', unsafe_allow_html=True)

    try:
        module_temp = ambient_temp + (irradiation * 25) - (wind_speed * 0.2)
        
        input_data = {
            'AMBIENT_TEMPERATURE': [ambient_temp],
            'IRRADIATION': [irradiation],
            'MODULE_TEMPERATURE': [module_temp],
            'HUMIDITY': [humidity],
            'CLOUD_COVER': [cloud_cover],
            'WIND_SPEED': [wind_speed],
            'SYSTEM_CAPACITY_W': [system_capacity * 1000]
        }
        
        for city in trained_cities:
            input_data[f'CITY_{city}'] = [0]
        input_data[f'CITY_{selected_city}'] = [1]
        
        input_df = pd.DataFrame(input_data)
        
        feature_order = ['AMBIENT_TEMPERATURE', 'IRRADIATION', 'MODULE_TEMPERATURE', 'HUMIDITY', 'CLOUD_COVER', 'WIND_SPEED', 'SYSTEM_CAPACITY_W'] + [f'CITY_{c}' for c in sorted(trained_cities)]
        input_df = input_df[feature_order]

        predicted_watts = max(0, model.predict(input_df)[0])
        final_prediction_kw = predicted_watts / 1000.0

        hours = list(range(24))
        hourly_irradiation = [max(0, irradiation * np.sin((hour - 6) * np.pi / 12)) if 6 <= hour <= 18 else 0 for hour in hours]
        hourly_predictions_kw = []
        for hour_irr in hourly_irradiation:
            if hour_irr > 0:
                temp_module_hourly = ambient_temp + (hour_irr * 25) - (wind_speed * 0.2)
                temp_input_hourly = input_df.copy()
                temp_input_hourly['IRRADIATION'] = hour_irr
                temp_input_hourly['MODULE_TEMPERATURE'] = temp_module_hourly
                predicted_watts_hourly = max(0, model.predict(temp_input_hourly)[0])
                hourly_predictions_kw.append(predicted_watts_hourly / 1000.0)
            else:
                hourly_predictions_kw.append(0)

        daily_energy = sum(hourly_predictions_kw)
        monthly_energy = daily_energy * 30
        
        col1, col2, col3 = st.columns(3, gap="large")
        with col1:
            st.metric("⚡ Peak Power", f"{final_prediction_kw:.2f} kW")
        with col2:
            st.metric("🔋 Daily Energy", f"{daily_energy:.1f} kWh")
        with col3:
            st.metric("📅 Monthly Energy", f"{monthly_energy:.0f} kWh")
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        col1, col2 = st.columns([1,1], gap="large")

        with col1:
            st.markdown('<div class="section-header">📈 Performance Analysis</div>', unsafe_allow_html=True)
            ideal_input_df = input_df.copy()
            ideal_input_df['CLOUD_COVER'] = 0
            ideal_watts = max(0, model.predict(ideal_input_df)[0])
            ideal_prediction_kw = ideal_watts / 1000.0
            
            performance_data = pd.DataFrame({"Scenario": ["Current Prediction", "Ideal (Clear Sky)"], "Power (kW)": [final_prediction_kw, ideal_prediction_kw]})
            
            fig_bar = go.Figure(data=[go.Bar(
                x=performance_data["Scenario"],
                y=performance_data["Power (kW)"],
                marker_color=['#818cf8', '#10b981'],
                text=[f'{val:.2f} kW' for val in performance_data["Power (kW)"]],
                textposition='outside'
            )])
            fig_bar.update_layout(
                title_text='Current vs. Ideal Performance',
                xaxis_title='',
                yaxis_title='Peak Power (kW)',
                height=400,
                showlegend=False,
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font_color='white'
            )
            st.plotly_chart(fig_bar, use_container_width=True)

        with col2:
            st.markdown('<div class="section-header">💡 Smart Recommendations</div>', unsafe_allow_html=True)
            recommendations = []
            if cloud_cover > 70:
                recommendations.append(f"☁️ **High Cloud Cover**: The high cloud cover of {cloud_cover}% is the primary factor limiting generation. Performance is weather-dependent.")
            
            if final_prediction_kw < (system_capacity * 0.2) and irradiation > 0.5:
                recommendations.append(f"🔴 **Underperformance Alert**: The predicted output is unusually low for the given sunlight. Consider checking for panel shading or system health.")
            else:
                recommendations.append("✅ **System Performing as Expected**: Your system is performing well under the specified weather conditions.")
            
            for rec in recommendations:
                st.info(rec)

        if st.button("Go Back to Input Page"):
            st.session_state.pop('inputs', None)
            switch_page('input')

    except Exception as e:
        st.error(f"❌ An error occurred during prediction. Please check your inputs. Details: {e}")
        if st.button("Go Back to Input Page"):
            st.session_state.pop('inputs', None)
            switch_page('input')
