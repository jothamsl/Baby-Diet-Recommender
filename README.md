# AI-Based Nutrition Guide System for Babies

A comprehensive web application that provides personalized, age-appropriate meal recommendations for babies (0-36 months) based on WHO growth standards and nutritional science.

## Features

### 🍼 Age-Appropriate Recommendations
- **0-5 months**: Exclusive breastfeeding guidance
- **6-8 months**: Introduction to solid foods (Category 1)
- **9-12 months**: Varied textures and flavors (Category 2)
- **13-36 months**: Family foods and complex meals (Category 3)

### 📊 WHO Growth Standards
- Accurate Z-score calculations using WHO LMS tables
- Weight-for-age and height-for-age assessments
- Nutritional status classification (Normal, Underweight, Overweight)
- Personalized caloric and nutrient requirements

### 🥗 Smart Meal Planning
- Cosine similarity-based meal matching
- Allergen filtering and safety considerations
- Meal distribution (30% breakfast, 40% lunch, 30% dinner)
- Nutritional match explanations

### 🔒 Safety First
- Input validation and sanitization
- Allergen warnings and filtering
- Age-appropriate food safety recommendations
- WHO-compliant nutritional guidelines

## Technology Stack

### Frontend
- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Flask** - Python web framework
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning
- **SciPy** - Scientific computing

## Project Structure

```
Baby-Diet-Recommender/
├── app/                          # Next.js frontend
│   ├── page.js                   # Main application page
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   └── ui/                       # UI components
├── flask_backend/                # Flask backend
│   ├── app/                      # Application code
│   │   ├── __init__.py          # App factory
│   │   ├── routes/              # API routes
│   │   │   ├── api.py           # Main API endpoints
│   │   │   ├── auth.py          # Authentication
│   │   │   └── admin.py         # Admin routes
│   │   └── services/            # Business logic
│   │       ├── nutrition_service.py      # WHO calculations
│   │       └── recommendation_service.py # ML recommendations
│   ├── requirements.txt         # Python dependencies
│   └── run.py                   # Application entry point
├── data/                        # Data files
│   ├── enhanced_meals.csv       # Meal database
│   ├── who_lms_*.csv           # WHO growth standards
│   ├── model.pkl               # Trained ML model
│   └── recommendations_log/    # Saved recommendations
└── package.json                # Node.js dependencies
```

## Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Baby-Diet-Recommender
```

### 2. Frontend Setup
```bash
# Install Node.js dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd flask_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python run.py
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: https://baby-diet-flask-backend.onrender.com

## API Endpoints

### Health Check
```http
GET /api/health
```

### Meal Recommendations
```http
POST /api/submissions
Content-Type: application/json

{
  "parent_name": "John Doe",
  "name": "Baby Sarah",
  "age": 8,
  "weight": 7.5,
  "height": 68.5,
  "sex": "female",
  "allergies": "dairy, eggs"
}
```

### Download Meal Plan
```http
POST /api/download-plan
Content-Type: application/json

{
  "baby_info": {...},
  "meal_plan": {...}
}
```

### Growth Metrics
```http
POST /api/growth-metrics
Content-Type: application/json

{
  "age": 8,
  "weight": 7.5,
  "height": 68.5,
  "sex": "female"
}
```

## Usage Guide

### 1. Basic Assessment
1. Enter parent/caregiver name
2. Enter baby's name
3. Provide age (0-36 months)
4. Enter current weight (kg)
5. Enter current height (cm)
6. Select sex (male/female)
7. List any known allergies (optional)
8. Click "Get Meal Recommendations"

### 2. Understanding Results

#### For Babies 0-5 Months
- Displays breastfeeding guidance
- No solid food recommendations
- WHO-compliant advice

#### For Babies 6+ Months
- **Growth Metrics**: Z-scores and nutritional status
- **Daily Needs**: Caloric and nutrient requirements
- **Meal Plan**: Personalized recommendations by meal type
- **Safety**: Allergen warnings and age-appropriate foods

### 3. Meal Recommendations
Each recommendation includes:
- **Meal Name**: Descriptive title
- **Ingredients**: Complete ingredient list
- **Procedure**: Step-by-step instructions
- **Nutrition**: Caloric and nutrient content
- **Match Score**: Similarity to nutritional needs
- **Safety Info**: Preparation time and difficulty

### 4. Download Options
- **CSV Format**: Complete meal plan with nutritional data
- **Future Training**: Data saved for model improvement

## Data Sources

### WHO Growth Standards
- Weight-for-age LMS tables (boys and girls)
- Height-for-age LMS tables (boys and girls)
- Official WHO reference data

### Meal Database
- Age-categorized meals (45+ recipes)
- Nutritional information per serving
- Allergen classifications
- Preparation details

### Nutritional Requirements
- Age-based caloric needs
- Protein requirements (g/kg/day)
- Fat percentage recommendations
- Carbohydrate distribution

## Security Considerations

### Input Validation
- Age range: 0-36 months
- Weight/height: Positive values only
- Name length: 50 characters maximum
- Allergen sanitization

### Data Privacy
- No personal data stored permanently
- Recommendations logged for model training only
- CORS protection enabled

### Safety Features
- Allergen filtering
- Age-appropriate food warnings
- WHO-compliant recommendations

## Development

### Adding New Meals
1. Edit `data/enhanced_meals.csv`
2. Include required columns:
   - `meal_id`, `meal_name`, `ingredients`
   - `age_category`, `allergens`, `meal_type`
   - Nutritional values and preparation details

### Updating WHO Data
1. Replace LMS tables in `data/who_lms_*.csv`
2. Maintain column structure: `Month`, `L`, `M`, `S`

### Model Training
1. Recommendations are logged in `data/recommendations_log/`
2. Use logged data for model retraining
3. Replace `data/model.pkl` with updated model

## Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check Python version
python --version

# Verify virtual environment
which python

# Install missing dependencies
pip install -r requirements.txt
```

#### Frontend Build Errors
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
- Verify backend is running on port 5001
- Check CORS settings
- Ensure no firewall blocking

### Error Messages

#### "No meals data available"
- Check `data/enhanced_meals.csv` exists
- Verify file format and headers

#### "Unable to calculate growth metrics"
- Ensure WHO LMS data files are present
- Check age/weight/height values are reasonable

#### "Network error"
- Confirm backend server is running
- Check browser console for CORS errors

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

### Code Standards
- Follow PEP 8 for Python code
- Use Prettier for JavaScript formatting
- Add comments for complex logic
- Include error handling

### Testing
```bash
# Backend testing
cd flask_backend
python -m pytest

# Frontend testing
npm test
```

## License
This project is licensed under the MIT License.

## Support
For issues and questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with details

## Acknowledgments
- World Health Organization for growth standards
- Open source community for tools and libraries
- Nutritional science research community