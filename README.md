# Data Analytics Project 2026

# Compost Coders - Closing the loop on organic waste 

## About the project

Sources: 
- https://kuituhamppu.frostbit.fi/composting/measurements

The dataset provided offers insights into the feasibility of using hemp as a raw material for energy pellets, building insulation, and growing media, while also considering the economic viability of production. Our goal was to support this project by making the data accessible and easy to understand for both experts in the field and those less familiar with the topic. In addition, we aim to compare hemp with other composting materials to evaluate its performance and potential advantages.

## Quick overview of the data

The dataset includes measurements from hemp and other composting materials, capturing parameters such as temperature, energy content, thermal conductivity, and sensor readings. 

- **Columns / Features:** temperature, moisture content, energy content, thermal conductivity, sensor ID, timestamp
- **Data format:** CSV
- **Notes:** Some sensors show high zero-reading rates; Sensor 02 has high variability and may need review.

## Key Takeaways

- **Thermophilic activity:** Peak temperatures of 55–60 °C were observed early in the composting cycles, consistent with the active thermophilic decomposition phase.
- **Sensor reliability:** Several sensors recorded high zero-reading rates (>56%), indicating potential measurement issues.
- **Sensor variability:** Sensor 02 showed unusually high variability and should be reviewed before final deployment.
- **Comparison potential:** The dataset allows for comparison of hemp with other composting materials regarding thermal performance, energy content, and other key parameters.

## Installation and setup

### 1. Clone the Repository
```bash
git clone https://github.com/Compost-Coders/composting-coders.git
cd composting-coders
# Create venv
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# OR Activate (Mac/Linux)
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

## Technologies
- python >= 3.10
- pandas
- numpy
- matplotlib
- seaborn


## Repository Structure

├── data/                    # datasets <br>
├── notebooks/               # Jupyter Notebooks for EDA and prototyping <br>
├── src/                     # Reusable Python modules & helper functions <br>
├── web/                     # Web-App code <br>
├── report/                 # Final PDF report and exported figures <br>
├── .gitignore               # Files and folders to be ignored by Git <br>
├── CONTRIBUTING.md          # Team workflow and coding guidelines <br>
└── requirements.txt         # Project dependencies <br>

## The Team
- Jan Raivio - Team Leader
- Natalia Suopanki
- Laura Ryönänkoski
- Savindu Kariyawasam
- Fabian Frank

