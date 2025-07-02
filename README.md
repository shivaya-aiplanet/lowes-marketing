# Lowe's Marketing AI Analysis System

A real-time AI-powered social media analysis system for Lowe's marketing team, featuring competitor analysis, performance tracking, and strategic recommendations using live web search and AI insights.

## 🚀 Features

- **Real-time Competitor Analysis**: Live web search for Home Depot, Menards, Wayfair, and Ace Hardware
- **Lowe's Performance Tracking**: Instagram, Facebook, and Twitter analytics
- **AI Campaign Analysis**: Google Ads and Meta Ads performance insights
- **Strategic Recommendations**: AI-generated content strategies and market opportunities
- **Live Data**: Powered by Tavily API for real-time web search
- **AI Intelligence**: Enhanced pattern analysis and performance predictions

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Lucide React** for icons

### Backend
- **FastAPI** with Python 3.8+
- **Tavily API** for real-time web search
- **AI Analysis Engine** for intelligent insights
- **Async processing** for concurrent analysis

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Tavily API Key** (for web search)

## 🚀 Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/shivaya-aiplanet/lowes-marketing.git
cd lowes-marketing
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install fastapi uvicorn requests python-multipart

# Start the backend server
python focused_server.py
```
Backend will run on: `http://localhost:8002`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will run on: `http://localhost:5173`

### 4. Environment Configuration
The Tavily API key is currently embedded in the code for development. For production:

1. Create `.env` file in backend directory
2. Add: `TAVILY_API_KEY=your_api_key_here`
3. Update code to use environment variable

## 🎯 Usage

### Dashboard Navigation
1. Open `http://localhost:5173`
2. Click on any analysis card:
   - **Competitor Analysis**: Real-time competitor social media data
   - **Lowe's Performance**: Cross-platform performance metrics
   - **Ad Campaign Analysis**: Campaign performance insights
   - **AI Strategy & Content**: Strategic recommendations

### Analysis Features
- **Real Data**: All follower counts and engagement metrics from live web search
- **AI Insights**: Intelligent analysis with performance predictions
- **Seasonal Context**: Current market opportunities and trends
- **Strategic Recommendations**: Actionable insights for content optimization

## 📊 Sample Output

```
🔍 HOME DEPOT - REAL DATA:
• REAL ANSWER: Home Depot has over 2 million Instagram followers
• FOLLOWERS: 2.0M followers
• ENGAGEMENT: 3,520 likes

🤖 AI LLM ENHANCED INSIGHTS:
• Gap Analysis: Competitors weak in smart home DIY content (45% opportunity)
• Summer DIY projects trending +67% - capitalize on outdoor living content
• Prediction: 25% growth potential with consistent posting
```

## 🔧 API Endpoints

### Backend API (Port 8002)
- `POST /api/analyze/competitors` - Start competitor analysis
- `POST /api/analyze/lowes` - Start Lowe's performance analysis
- `POST /api/analyze/campaigns` - Start campaign analysis
- `POST /api/analyze/strategy` - Start strategy generation
- `GET /api/results/{task_id}` - Get analysis results
- `GET /api/agents/status` - Get agent status

## 🏗 Architecture

```
Frontend (React/Vite) → Backend (FastAPI) → Tavily API → AI Analysis
     ↓                      ↓                  ↓            ↓
  Dashboard UI         Async Processing    Web Search    Insights
```

## 🔍 Data Sources

- **Tavily API**: Real-time web search for social media data
- **Live Social Platforms**: Instagram, Facebook, Twitter metrics
- **Market Research**: Current trends and benchmarks
- **AI Analysis**: Pattern recognition and performance predictions

## 🚀 Deployment Notes

- Backend runs on any Python 3.8+ environment
- Frontend builds to static files with `npm run build`
- Environment variables needed for production API keys
- CORS configured for local development

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is for internal use by Lowe's marketing team.

## 🔧 Troubleshooting

### Common Issues

1. **Backend not starting**: Check Python version and dependencies
2. **Frontend not loading**: Ensure Node.js 16+ and run `npm install`
3. **API errors**: Verify Tavily API key and internet connection
4. **CORS issues**: Backend configured for localhost:5173

### Support
For technical issues, check the console logs in both frontend and backend terminals.
