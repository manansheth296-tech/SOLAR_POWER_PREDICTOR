Here is a polished and professional README for your ☀️ SunSight AI: Solar Power Predictor project, incorporating best practices and clear organization to highlight all key details:

***

# ☀️ SunSight AI: Solar Power Predictor

## Project Overview  
SunSight AI is an end-to-end full-stack web application designed to provide **accurate solar power generation predictions** using state-of-the-art machine learning. The system integrates real-time weather data with a tailored AI model trained on solar and meteorological conditions for over 30 major Indian cities. This project demonstrates the full lifecycle—from data fetching and model training to delivering dynamic, AI-powered insights via an intuitive dashboard.

***

## Key Features  
- **Real-Time Weather Integration:** Uses live weather APIs to power dynamic predictions.  
- **City-Specific Modeling:** AI model trained with extensive data from Indian cities for higher accuracy.  
- **Interactive Dashboard:** Sleek UI built with React and Tailwind CSS providing seamless exploration of predictions and performance metrics.  
- **Smart Recommendations:** Customized tips based on weather conditions to optimize solar power outcomes.  
- **Detailed Sensitivity Analysis:** Interactive visualizations showing how environmental factors affect solar output.

***

## 🛠️ Technology Stack

### Frontend  
- **React** with **TypeScript** for building a performant, type-safe UI.  
- **Vite** for fast, modern build tooling.  
- **Tailwind CSS** to rapidly prototype beautiful, responsive designs.  
- **Recharts** for interactive, data-rich charts and graphs.

### Backend  
- **Python** for AI model development and data processing.  
- **FastAPI** serving the prediction API with high performance and async capabilities.  
- **Uvicorn** ASGI server to run FastAPI smoothly.

### Machine Learning  
- **Scikit-learn RandomForestRegressor:** Core regression model predicting solar generation.  
- **Joblib:** Serialize/deserialize ML models efficiently.  
- **Pandas & NumPy:** Data wrangling and numerical computations.

***

## 🚀 Getting Started

### Prerequisites  
- Node.js & npm ([download here](https://nodejs.org/))  
- Python 3.8 or higher ([download here](https://www.python.org/))  
- Git ([download here](https://git-scm.com/))  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manansheth296-tech/SOLAR_POWER_PREDICTOR.git
   cd SOLAR_POWER_PREDICTOR
   ```

2. Install Python backend dependencies:
   ```bash
   pip install "fastapi[all]" uvicorn scikit-learn pandas numpy requests plotly
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. **Prepare Data & Train Model (run once):**
   ```bash
   python fetch.py
   python training.py
   ```

2. **Start Backend API:**
   ```bash
   uvicorn api:app --reload
   ```
   The API will be accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).

3. **Start Frontend Dashboard:**
   ```bash
   npm run dev
   ```
   This launches the React app, which connects to the backend API for live solar power predictions.

***

## How It Works

- The backend uses a **RandomForestRegressor** trained with historical weather and solar data for major cities in India.  
- On the frontend, users can input their location (auto-detected via GPS or manually selected) and system details like capacity.  
- Live weather data is fetched and combined with user input to make **real-time solar power output predictions**.  
- Users see peak power, estimated daily and monthly energy, plus graphical analysis of system performance and environmental sensitivity.

***

## Problem Statement

Distributed solar power generation is highly dependent on variable weather conditions, making accurate predictions challenging but vital for optimizing grid and home energy management. SunSight AI addresses this by providing a sophisticated, user-friendly tool that:

- Utilizes AI to anticipate solar output under fluctuating weather.  
- Empowers users with actionable insights and alerts for system health and efficiency.  
- Demonstrates AI’s potential for sustainable energy solutions in the Indian context.

***

## Future Enhancements

- Integration of deep learning models for improved short-term solar forecasting.  
- Expansion of model training with more granular weather data and additional cities.  
- Advanced user analytics and personalized system optimization recommendations.  
- Mobile app version for ubiquitous access.

***

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/manansheth296-tech/SOLAR_POWER_PREDICTOR/issues) or submit pull requests.

***

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

***

This README provides a comprehensive, clean introduction and guide for developers or users engaging with SunSight AI. If you want, I can help generate automated docs or even API specs next!

[1](https://github.com/Grv-Singh/Solar-Power-Forecasting)
[2](https://pmc.ncbi.nlm.nih.gov/articles/PMC10550187/)
[3](https://www.youtube.com/watch?v=uWbTBVyfdS4)
[4](https://www.scribd.com/presentation/829024962/FInal-Project-Report-Predicting-Solar-Power-Output-using-linear-regression)
[5](https://www.kaggle.com/code/pythonafroz/27-regression-models-for-solar-power-prediction)
[6](https://cran.r-project.org/web/packages/nasapower/readme/README.html)
[7](https://www.scribd.com/document/809303782/125986262)
