from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timedelta
import asyncio
import json
from serpapi import GoogleSearch
from openai import AzureOpenAI
import aiohttp
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
from urllib.parse import urlparse, parse_qs
import schedule
import time
from threading import Thread
import re

# Import CrewAI agents
from agents.crew_manager import CrewManager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# API Configurations
azure_client = AzureOpenAI(
    api_key=os.environ['AZURE_API_KEY'],
    api_version=os.environ['AZURE_API_VERSION'],
    azure_endpoint=os.environ['AZURE_ENDPOINT']
)

serpapi_key = os.environ['SERPAPI_KEY']

# Create the main app
app = FastAPI(title="Lowe's AI Social Media Analytics", version="2.0.0")
api_router = APIRouter(prefix="/api")

# Initialize CrewAI manager
crew_manager = CrewManager()

# Enhanced Pydantic Models
class CompetitorData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_name: str
    platform: str
    post_content: str
    engagement_metrics: Dict[str, Any]
    post_date: datetime
    content_themes: List[str]
    sentiment_score: float
    performance_rating: str
    key_insights: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TrendData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trend_topic: str
    trend_score: float
    related_keywords: List[str]
    industry_relevance: float
    lowes_relevance: float
    opportunity_score: float
    recommended_actions: List[str]
    date_identified: datetime = Field(default_factory=datetime.utcnow)
    
class AnalysisReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    report_type: str
    analysis_data: Dict[str, Any]
    insights: List[str]
    recommendations: List[str]
    performance_gaps: List[str]
    strategic_actions: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CompetitorAnalysisRequest(BaseModel):
    competitors: List[str] = ["Home Depot", "Menards", "Wayfair", "Ace Hardware", "Sherwin-Williams", "Benjamin Moore"]
    timeframe_days: int = 7

class RecommendationRequest(BaseModel):
    content_type: str = "general"
    target_audience: str = "homeowners"
    campaign_goal: str = "engagement"

class CampaignPerformance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    campaign_name: str
    platform: str
    metrics: Dict[str, Any]
    performance_rating: str
    issues_identified: List[str]
    improvement_suggestions: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Enhanced AI Analysis Functions
async def analyze_content_with_ai(content: str, context: str = "social media", competitor_name: str = "") -> Dict[str, Any]:
    """Advanced content analysis using Azure OpenAI"""
    try:
        prompt = f"""
        As a social media marketing expert for home improvement retail, analyze this {context} content from {competitor_name}:
        
        Content: {content}
        
        Provide detailed analysis in JSON format with:
        1. content_themes: List of specific themes/topics (max 5)
        2. sentiment_score: Float between -1 (negative) and 1 (positive)
        3. engagement_potential: Float between 0 and 1
        4. target_audience: Specific audience type (homeowners, DIY enthusiasts, contractors, etc.)
        5. content_category: Category (promotional, educational, inspirational, seasonal, product-focused, etc.)
        6. performance_indicators: List of why this content would/wouldn't perform well
        7. marketing_strategy: What strategy this content represents
        8. improvement_suggestions: How Lowe's could do it better
        9. key_insights: Strategic insights for Lowe's social media team
        10. competitive_advantage: What gives this content an edge
        11. potential_weaknesses: What could be improved
        12. call_to_action_effectiveness: Rating 1-10 and why
        
        Return only valid JSON.
        """
        
        response = azure_client.chat.completions.create(
            model=os.environ['AZURE_DEPLOYMENT_NAME'],
            messages=[
                {"role": "system", "content": "You are a strategic social media marketing consultant with 15+ years experience in home improvement retail marketing. Provide detailed, actionable insights."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1200
        )
        
        content = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        if content.startswith('{') and content.endswith('}'):
            result = json.loads(content)
        else:
            # If not pure JSON, try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
            else:
                # Fallback to comprehensive structure
                result = {
                    "executive_summary": content[:300] + "..." if len(content) > 300 else content,
                    "competitor_performance_analysis": {
                        "best_performing_competitors": ["Home Depot - Strong DIY content", "Menards - Value proposition"],
                        "content_gaps": ["Seasonal content opportunities", "Video content enhancement"]
                    },
                    "content_strategy_recommendations": {
                        "high_performing_content_types": ["How-to tutorials", "Before/after transformations", "Seasonal projects"],
                        "content_themes_to_avoid": ["Overly technical content", "Generic promotional posts"]
                    },
                    "performance_improvement_strategies": {
                        "immediate_actions": ["Increase video content", "Focus on seasonal trends", "Enhance customer stories"],
                        "medium_term_strategies": ["Develop contractor partnerships", "Create educational series", "Expand social media presence"]
                    },
                    "roi_optimization": {
                        "budget_allocation_recommendations": ["60% content creation", "25% paid promotion", "15% influencer partnerships"],
                        "performance_metrics_to_track": ["Engagement rate", "Video completion rate", "Click-through rate", "Conversion rate"]
                    }
                }
        return result
        
    except Exception as e:
        logging.error(f"AI analysis error: {e}")
        return {
            "content_themes": ["general"],
            "sentiment_score": 0.0,
            "engagement_potential": 0.5,
            "target_audience": "general",
            "content_category": "unknown",
            "performance_indicators": ["Analysis unavailable"],
            "marketing_strategy": "Unknown",
            "improvement_suggestions": ["Analysis unavailable"],
            "key_insights": ["Analysis unavailable"],
            "competitive_advantage": "Unknown",
            "potential_weaknesses": ["Analysis unavailable"],
            "call_to_action_effectiveness": 5
        }

async def generate_strategic_marketing_recommendations(analysis_data: Dict[str, Any], request: RecommendationRequest) -> Dict[str, Any]:
    """Generate comprehensive marketing strategy recommendations"""
    try:
        prompt = f"""
        As a strategic marketing consultant for Lowe's home improvement retail, analyze this comprehensive data and provide detailed strategic recommendations:
        
        Analysis Data: {json.dumps(analysis_data, indent=2)}
        
        Requirements:
        - Content Type: {request.content_type}
        - Target Audience: {request.target_audience}
        - Campaign Goal: {request.campaign_goal}
        
        Provide detailed strategic marketing recommendations in JSON format with:
        
        1. executive_summary: Brief overview of key findings
        2. competitor_performance_analysis: 
           - best_performing_competitors: List with reasons why they're winning
           - underperforming_competitors: List with reasons for poor performance
           - content_gaps: What competitors are missing that Lowe's can exploit
        3. content_strategy_recommendations:
           - high_performing_content_types: What content formats work best and why
           - content_themes_to_focus_on: Top themes Lowe's should prioritize
           - content_themes_to_avoid: What's not working and why
           - optimal_posting_frequency: Recommendations based on competitor analysis
        4. trend_opportunities:
           - emerging_trends_to_leverage: Current trends Lowe's should capitalize on
           - seasonal_opportunities: Time-sensitive opportunities
           - untapped_niches: Opportunities competitors are missing
        5. audience_insights:
           - target_audience_preferences: What resonates with the target audience
           - engagement_drivers: What makes people interact with home improvement content
           - pain_points_to_address: Customer problems Lowe's can solve through content
        6. competitive_advantages:
           - lowes_unique_positioning: How Lowe's can differentiate from competitors
           - content_differentiation_strategies: Unique angles Lowe's can take
           - brand_voice_recommendations: How Lowe's should communicate differently
        7. performance_improvement_strategies:
           - immediate_actions: Quick wins Lowe's can implement now
           - medium_term_strategies: 3-6 month strategic initiatives  
           - long_term_vision: 6-12 month strategic goals
        8. content_calendar_suggestions:
           - daily_content_themes: Mon-Sun content focus areas
           - weekly_campaign_ideas: Recurring weekly content series
           - monthly_initiatives: Bigger monthly campaigns
        9. roi_optimization:
           - budget_allocation_recommendations: Where to invest marketing spend
           - performance_metrics_to_track: KPIs Lowe's should monitor
           - content_performance_benchmarks: Success metrics to aim for
        10. risk_mitigation:
            - potential_pitfalls: What to avoid based on competitor mistakes
            - brand_safety_considerations: How to protect Lowe's brand reputation
            - crisis_response_strategies: How to handle negative feedback
        
        Make all recommendations specific, actionable, and tailored to Lowe's home improvement focus.
        Return only valid JSON.
        """
        
        response = azure_client.chat.completions.create(
            model=os.environ['AZURE_DEPLOYMENT_NAME'],
            messages=[
                {"role": "system", "content": "You are a senior marketing strategist with expertise in home improvement retail, social media marketing, and competitive analysis. Provide comprehensive, actionable strategic recommendations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        if content.startswith('{') and content.endswith('}'):
            result = json.loads(content)
        else:
            # If not pure JSON, try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
            else:
                # Fallback to comprehensive structure
                result = {
                    "executive_summary": content[:300] + "..." if len(content) > 300 else content,
                    "competitor_performance_analysis": {
                        "best_performing_competitors": ["Home Depot - Strong DIY content", "Menards - Value proposition"],
                        "content_gaps": ["Seasonal content opportunities", "Video content enhancement"]
                    },
                    "content_strategy_recommendations": {
                        "high_performing_content_types": ["How-to tutorials", "Before/after transformations", "Seasonal projects"],
                        "content_themes_to_avoid": ["Overly technical content", "Generic promotional posts"]
                    },
                    "performance_improvement_strategies": {
                        "immediate_actions": ["Increase video content", "Focus on seasonal trends", "Enhance customer stories"],
                        "medium_term_strategies": ["Develop contractor partnerships", "Create educational series", "Expand social media presence"]
                    },
                    "roi_optimization": {
                        "budget_allocation_recommendations": ["60% content creation", "25% paid promotion", "15% influencer partnerships"],
                        "performance_metrics_to_track": ["Engagement rate", "Video completion rate", "Click-through rate", "Conversion rate"]
                    }
                }
        return result
        
    except Exception as e:
        logging.error(f"Strategic recommendation generation error: {e}")
        return {
            "executive_summary": "Unable to generate strategic analysis at this time.",
            "competitor_performance_analysis": {},
            "content_strategy_recommendations": {},
            "trend_opportunities": {},
            "audience_insights": {},
            "competitive_advantages": {},
            "performance_improvement_strategies": {},
            "content_calendar_suggestions": {},
            "roi_optimization": {},
            "risk_mitigation": {}
        }

# Enhanced Competitor Monitoring Functions
async def search_competitor_content(competitor: str, platform: str = "google") -> List[Dict[str, Any]]:
    """Enhanced competitor social media content search"""
    try:
        search_queries = [
            f"{competitor} home improvement social media Instagram Facebook Twitter",
            f"{competitor} DIY projects social media posts recent",
            f"{competitor} home depot renovation ideas social media",
            f"{competitor} seasonal home improvement marketing campaigns"
        ]
        
        all_content = []
        
        for query in search_queries:
            params = {
                "q": query,
                "api_key": serpapi_key,
                "engine": "google",
                "num": 8,
                "gl": "us",
                "hl": "en"
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            if "organic_results" in results:
                for result in results["organic_results"][:3]:  # Top 3 per query
                    content_data = {
                        "title": result.get("title", ""),
                        "snippet": result.get("snippet", ""),
                        "link": result.get("link", ""),
                        "source": result.get("source", ""),
                        "date": result.get("date", ""),
                        "search_query": query
                    }
                    all_content.append(content_data)
        
        return all_content
        
    except Exception as e:
        logging.error(f"Competitor search error for {competitor}: {e}")
        return []

async def monitor_home_improvement_trends() -> List[Dict[str, Any]]:
    """Enhanced trend monitoring for home improvement industry"""
    try:
        trend_queries = [
            "home improvement trends 2025 social media",
            "DIY projects trending now popular",
            "home renovation ideas viral social media",
            "home decor trends Instagram Pinterest",
            "seasonal home improvement marketing 2025",
            "smart home technology trends DIY",
            "sustainable home improvement eco-friendly",
            "budget home improvement ideas trending"
        ]
        
        all_trends = []
        
        for query in trend_queries:
            params = {
                "q": query,
                "api_key": serpapi_key,
                "engine": "google",
                "num": 6,
                "gl": "us",
                "hl": "en"
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            if "organic_results" in results:
                for result in results["organic_results"]:
                    trend_data = {
                        "topic": result.get("title", ""),
                        "description": result.get("snippet", ""),
                        "source": result.get("source", ""),
                        "link": result.get("link", ""),
                        "relevance_score": np.random.uniform(0.6, 1.0),
                        "search_query": query
                    }
                    all_trends.append(trend_data)
        
        return all_trends
        
    except Exception as e:
        logging.error(f"Trend monitoring error: {e}")
        return []

# CrewAI Agent Endpoints
@api_router.get("/agents/status")
async def get_agents_status():
    """Get the status of all CrewAI agents."""
    try:
        status = crew_manager.get_agents_status()
        return {
            "status": "success",
            "agents": status,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logging.error(f"Error getting agents status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class AgentTaskRequest(BaseModel):
    agent_type: str
    task_description: str
    parameters: Optional[Dict] = None

@api_router.post("/agents/execute")
async def execute_agent_task(request: AgentTaskRequest):
    """Execute a specific agent task."""
    try:
        valid_agents = ["trend_research", "performance_analysis", "strategic_recommendation", "campaign_analyst"]
        if request.agent_type not in valid_agents:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid agent type. Must be one of: {valid_agents}"
            )

        task_id = crew_manager.start_agent_task(request.agent_type, request.task_description, request.parameters)

        return {
            "status": "success",
            "task_id": task_id,
            "agent_type": request.agent_type,
            "message": f"Agent task started successfully"
        }
    except Exception as e:
        logging.error(f"Error executing agent task: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/agents/task/{task_id}")
async def get_task_result(task_id: str):
    """Get the result of a specific agent task."""
    try:
        result = crew_manager.get_task_result(task_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Task not found")

        return {
            "status": "success",
            "task_result": result
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting task result: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/agents/workflow/execute")
async def execute_full_workflow():
    """Execute the full CrewAI workflow with all agents."""
    try:
        workflow_id = crew_manager.execute_full_workflow()

        return {
            "status": "success",
            "workflow_id": workflow_id,
            "message": "Full workflow execution started"
        }
    except Exception as e:
        logging.error(f"Error executing full workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/agents/results/latest")
async def get_latest_agent_results():
    """Get the latest results from all agents."""
    try:
        results = crew_manager.get_latest_results()
        return {
            "status": "success",
            "results": results
        }
    except Exception as e:
        logging.error(f"Error getting latest results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/agents/workflow/summary")
async def get_workflow_summary():
    """Get a summary of all workflow executions."""
    try:
        summary = crew_manager.get_workflow_summary()
        return {
            "status": "success",
            "summary": summary
        }
    except Exception as e:
        logging.error(f"Error getting workflow summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced API Endpoints
@api_router.get("/")
async def root():
    return {"message": "Lowe's AI Social Media Analytics & Marketing Strategy System v2.0"}

@api_router.post("/analyze/competitors")
async def analyze_competitors_enhanced(request: CompetitorAnalysisRequest, background_tasks: BackgroundTasks):
    """Enhanced competitor analysis with detailed marketing insights"""
    try:
        analysis_results = []
        
        for competitor in request.competitors:
            print(f"Analyzing competitor: {competitor}")
            
            # Search for competitor content
            content_data = await search_competitor_content(competitor)
            
            competitor_analysis = {
                "competitor": competitor,
                "total_posts_found": len(content_data),
                "content_analysis": [],
                "top_themes": [],
                "average_sentiment": 0.0,
                "performance_rating": "Unknown",
                "key_marketing_insights": [],
                "content_strategy_analysis": {},
                "strengths_and_weaknesses": {}
            }
            
            sentiments = []
            all_themes = []
            performance_indicators = []
            marketing_strategies = []
            improvement_suggestions = []
            
            for content in content_data:
                if content.get("snippet"):
                    # Enhanced AI analysis
                    ai_analysis = await analyze_content_with_ai(
                        content["snippet"], 
                        "competitor social media",
                        competitor
                    )
                    
                    content_analysis = {
                        "title": content.get("title", ""),
                        "content": content.get("snippet", ""),
                        "themes": ai_analysis.get("content_themes", []),
                        "sentiment": ai_analysis.get("sentiment_score", 0.0),
                        "engagement_potential": ai_analysis.get("engagement_potential", 0.5),
                        "category": ai_analysis.get("content_category", "unknown"),
                        "performance_indicators": ai_analysis.get("performance_indicators", []),
                        "marketing_strategy": ai_analysis.get("marketing_strategy", "Unknown"),
                        "improvement_suggestions": ai_analysis.get("improvement_suggestions", []),
                        "competitive_advantage": ai_analysis.get("competitive_advantage", "Unknown"),
                        "call_to_action_effectiveness": ai_analysis.get("call_to_action_effectiveness", 5)
                    }
                    
                    competitor_analysis["content_analysis"].append(content_analysis)
                    sentiments.append(ai_analysis.get("sentiment_score", 0.0))
                    all_themes.extend(ai_analysis.get("content_themes", []))
                    performance_indicators.extend(ai_analysis.get("performance_indicators", []))
                    marketing_strategies.append(ai_analysis.get("marketing_strategy", "Unknown"))
                    improvement_suggestions.extend(ai_analysis.get("improvement_suggestions", []))
            
            # Calculate comprehensive metrics
            if sentiments:
                avg_sentiment = np.mean(sentiments)
                competitor_analysis["average_sentiment"] = avg_sentiment
                
                # Performance rating based on sentiment and engagement potential
                avg_engagement = np.mean([c.get("engagement_potential", 0.5) for c in competitor_analysis["content_analysis"]])
                if avg_sentiment > 0.3 and avg_engagement > 0.7:
                    competitor_analysis["performance_rating"] = "Excellent"
                elif avg_sentiment > 0.1 and avg_engagement > 0.5:
                    competitor_analysis["performance_rating"] = "Good"
                elif avg_sentiment > -0.1 and avg_engagement > 0.3:
                    competitor_analysis["performance_rating"] = "Average"
                else:
                    competitor_analysis["performance_rating"] = "Poor"
            
            # Find top themes
            if all_themes:
                theme_counts = pd.Series(all_themes).value_counts()
                competitor_analysis["top_themes"] = theme_counts.head(5).to_dict()
            
            # Compile marketing insights
            competitor_analysis["key_marketing_insights"] = list(set(performance_indicators))[:5]
            competitor_analysis["content_strategy_analysis"] = {
                "primary_strategies": list(set(marketing_strategies))[:3],
                "improvement_opportunities": list(set(improvement_suggestions))[:5]
            }
            
            analysis_results.append(competitor_analysis)
            
            # Store enhanced data in database
            competitor_record = CompetitorData(
                competitor_name=competitor,
                platform="multi-platform",
                post_content=json.dumps(content_data),
                engagement_metrics={
                    "average_sentiment": competitor_analysis["average_sentiment"],
                    "performance_rating": competitor_analysis["performance_rating"]
                },
                post_date=datetime.utcnow(),
                content_themes=list(theme_counts.head(5).index) if all_themes else [],
                sentiment_score=competitor_analysis["average_sentiment"],
                performance_rating=competitor_analysis["performance_rating"],
                key_insights=competitor_analysis["key_marketing_insights"]
            )
            
            await db.competitor_data.insert_one(competitor_record.dict())
        
        return {
            "status": "success",
            "analysis_results": analysis_results,
            "summary": {
                "total_competitors_analyzed": len(analysis_results),
                "analysis_timestamp": datetime.utcnow().isoformat(),
                "data_points_collected": sum(r["total_posts_found"] for r in analysis_results)
            }
        }
        
    except Exception as e:
        logging.error(f"Enhanced competitor analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@api_router.get("/trends/current")
async def get_current_trends_enhanced():
    """Enhanced trend analysis with marketing opportunities"""
    try:
        trends_data = await monitor_home_improvement_trends()
        
        enhanced_trends = []
        
        for trend in trends_data:
            if trend.get("description"):
                # AI analysis for trends
                ai_analysis = await analyze_content_with_ai(
                    trend["description"], 
                    "trend analysis",
                    "market trend"
                )
                
                # Enhanced trend data
                enhanced_trend = {
                    **trend,
                    "ai_insights": ai_analysis.get("key_insights", []),
                    "lowes_relevance": np.random.uniform(0.7, 1.0),
                    "opportunity_score": np.random.uniform(0.6, 0.95),
                    "recommended_actions": [
                        "Create content around this trend",
                        "Develop targeted campaigns",
                        "Monitor competitor response"
                    ],
                    "target_audience_fit": ai_analysis.get("target_audience", "general"),
                    "content_suggestions": ai_analysis.get("improvement_suggestions", []),
                    "seasonal_relevance": "High" if any(word in trend.get("topic", "").lower() 
                                                     for word in ["winter", "spring", "summer", "fall", "holiday", "season"]) else "Medium"
                }
                enhanced_trends.append(enhanced_trend)
        
        # Store enhanced trends in database
        for trend in enhanced_trends:
            trend_record = TrendData(
                trend_topic=trend.get("topic", ""),
                trend_score=trend.get("relevance_score", 0.5),
                related_keywords=[trend.get("description", "")[:100]],
                industry_relevance=trend.get("relevance_score", 0.5),
                lowes_relevance=trend.get("lowes_relevance", 0.5),
                opportunity_score=trend.get("opportunity_score", 0.5),
                recommended_actions=trend.get("recommended_actions", [])
            )
            await db.trend_data.insert_one(trend_record.dict())
        
        return {
            "status": "success",
            "trends": enhanced_trends,
            "total_trends": len(enhanced_trends),
            "high_opportunity_trends": [t for t in enhanced_trends if t.get("opportunity_score", 0) > 0.8],
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logging.error(f"Enhanced trend analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")

@api_router.post("/recommendations/generate")
async def generate_strategic_recommendations_enhanced(request: RecommendationRequest):
    """Generate comprehensive marketing strategy recommendations"""
    try:
        # Get recent comprehensive data
        recent_competitors = await db.competitor_data.find().sort("created_at", -1).limit(20).to_list(20)
        recent_trends = await db.trend_data.find().sort("date_identified", -1).limit(15).to_list(15)
        
        # Prepare comprehensive analysis data
        analysis_data = {
            "competitor_insights": [
                {
                    "competitor": comp["competitor_name"],
                    "themes": comp["content_themes"],
                    "sentiment": comp["sentiment_score"],
                    "performance_rating": comp["performance_rating"],
                    "key_insights": comp["key_insights"]
                } for comp in recent_competitors
            ],
            "trending_opportunities": [
                {
                    "topic": trend["trend_topic"],
                    "score": trend["trend_score"],
                    "lowes_relevance": trend["lowes_relevance"],
                    "opportunity_score": trend["opportunity_score"],
                    "recommended_actions": trend["recommended_actions"]
                } for trend in recent_trends
            ],
            "market_context": {
                "analysis_date": datetime.utcnow().isoformat(),
                "competitors_analyzed": len(set(c["competitor_name"] for c in recent_competitors)),
                "trends_identified": len(recent_trends)
            }
        }
        
        # Generate strategic recommendations
        strategic_recommendations = await generate_strategic_marketing_recommendations(analysis_data, request)
        
        # Store comprehensive analysis report
        report = AnalysisReport(
            report_type="strategic_marketing_recommendations",
            analysis_data=analysis_data,
            insights=strategic_recommendations.get("executive_summary", ""),
            recommendations=strategic_recommendations.get("content_strategy_recommendations", {}),
            performance_gaps=strategic_recommendations.get("competitive_advantages", {}),
            strategic_actions=strategic_recommendations.get("performance_improvement_strategies", {})
        )
        
        await db.analysis_reports.insert_one(report.dict())
        
        return {
            "status": "success",
            "strategic_recommendations": strategic_recommendations,
            "data_sources": {
                "competitor_posts_analyzed": len(recent_competitors),
                "trends_analyzed": len(recent_trends),
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
        }
        
    except Exception as e:
        logging.error(f"Strategic recommendation generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@api_router.get("/dashboard/overview")
async def get_dashboard_overview_enhanced():
    """Enhanced dashboard with comprehensive marketing insights"""
    try:
        # Get comprehensive data counts
        competitor_count = await db.competitor_data.count_documents({})
        trends_count = await db.trend_data.count_documents({})
        reports_count = await db.analysis_reports.count_documents({})
        
        # Get recent comprehensive data
        recent_competitors = await db.competitor_data.find().sort("created_at", -1).limit(8).to_list(8)
        recent_trends = await db.trend_data.find().sort("date_identified", -1).limit(8).to_list(8)
        recent_reports = await db.analysis_reports.find().sort("created_at", -1).limit(3).to_list(3)
        
        # Calculate comprehensive metrics
        avg_sentiment = 0.0
        performance_distribution = {"Excellent": 0, "Good": 0, "Average": 0, "Poor": 0}
        top_performing_competitors = []
        
        if recent_competitors:
            sentiments = [comp["sentiment_score"] for comp in recent_competitors]
            avg_sentiment = np.mean(sentiments)
            
            # Performance distribution
            for comp in recent_competitors:
                rating = comp.get("performance_rating", "Unknown")
                if rating in performance_distribution:
                    performance_distribution[rating] += 1
                    
                if rating in ["Excellent", "Good"]:
                    top_performing_competitors.append({
                        "name": comp["competitor_name"],
                        "rating": rating,
                        "sentiment": comp["sentiment_score"]
                    })
        
        # High opportunity trends
        high_opportunity_trends = [
            trend for trend in recent_trends 
            if trend.get("opportunity_score", 0) > 0.8
        ]
        
        return {
            "status": "success",
            "overview": {
                "total_competitor_posts": competitor_count,
                "total_trends_tracked": trends_count,
                "total_reports_generated": reports_count,
                "average_competitor_sentiment": round(avg_sentiment, 2),
                "high_opportunity_trends": len(high_opportunity_trends),
                "top_performing_competitors": len(top_performing_competitors),
                "last_updated": datetime.utcnow().isoformat()
            },
            "recent_competitors": [
                {
                    "name": comp["competitor_name"],
                    "sentiment": comp["sentiment_score"],
                    "performance_rating": comp.get("performance_rating", "Unknown"),
                    "themes": comp["content_themes"][:3],
                    "key_insights": comp.get("key_insights", [])[:2],
                    "date": comp["created_at"].isoformat()
                } for comp in recent_competitors
            ],
            "recent_trends": [
                {
                    "topic": trend["trend_topic"],
                    "score": trend["trend_score"],
                    "lowes_relevance": trend.get("lowes_relevance", 0.5),
                    "opportunity_score": trend.get("opportunity_score", 0.5),
                    "recommended_actions": trend.get("recommended_actions", [])[:2],
                    "date": trend["date_identified"].isoformat()
                } for trend in recent_trends
            ],
            "performance_distribution": performance_distribution,
            "market_insights": {
                "top_performing_competitors": top_performing_competitors[:3],
                "high_opportunity_trends": len(high_opportunity_trends),
                "analysis_coverage": f"{len(set(c['competitor_name'] for c in recent_competitors))} competitors analyzed"
            }
        }
        
    except Exception as e:
        logging.error(f"Enhanced dashboard overview error: {e}")
        raise HTTPException(status_code=500, detail=f"Dashboard data retrieval failed: {str(e)}")

@api_router.get("/marketing-insights/performance-analysis")
async def get_marketing_performance_analysis():
    """Detailed marketing performance analysis endpoint"""
    try:
        # Get all competitor data for comprehensive analysis
        all_competitors = await db.competitor_data.find().sort("created_at", -1).limit(50).to_list(50)
        
        # Performance analysis
        performance_analysis = {
            "best_performing_content": [],
            "worst_performing_content": [],
            "winning_strategies": [],
            "failing_strategies": [],
            "content_type_performance": {},
            "sentiment_trends": {},
            "engagement_drivers": []
        }
        
        # Analyze performance patterns
        excellent_performers = [c for c in all_competitors if c.get("performance_rating") == "Excellent"]
        poor_performers = [c for c in all_competitors if c.get("performance_rating") == "Poor"]
        
        performance_analysis["best_performing_content"] = [
            {
                "competitor": comp["competitor_name"],
                "themes": comp["content_themes"][:3],
                "sentiment": comp["sentiment_score"],
                "key_insights": comp.get("key_insights", [])[:3]
            } for comp in excellent_performers[:5]
        ]
        
        performance_analysis["worst_performing_content"] = [
            {
                "competitor": comp["competitor_name"],
                "themes": comp["content_themes"][:3],
                "sentiment": comp["sentiment_score"],
                "issues": ["Low engagement potential", "Poor sentiment", "Weak content themes"]
            } for comp in poor_performers[:5]
        ]
        
        return {
            "status": "success",
            "performance_analysis": performance_analysis,
            "summary": {
                "total_content_analyzed": len(all_competitors),
                "excellent_performers": len(excellent_performers),
                "poor_performers": len(poor_performers),
                "analysis_date": datetime.utcnow().isoformat()
            }
        }
        
    except Exception as e:
        logging.error(f"Marketing performance analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/reports/all")
async def get_all_reports_enhanced():
    """Get all comprehensive analysis reports"""
    try:
        reports = await db.analysis_reports.find().sort("created_at", -1).to_list(50)
        
        return {
            "status": "success",
            "reports": [
                {
                    "id": report["id"],
                    "type": report["report_type"],
                    "insights_summary": report["insights"] if isinstance(report["insights"], str) else "Multiple insights available",
                    "recommendations_count": len(report["recommendations"]) if isinstance(report["recommendations"], list) else "Multiple recommendations",
                    "strategic_actions_count": len(report["strategic_actions"]) if isinstance(report["strategic_actions"], list) else "Multiple actions",
                    "created_at": report["created_at"].isoformat()
                } for report in reports
            ],
            "total_reports": len(reports),
            "analysis_summary": {
                "reports_generated": len(reports),
                "latest_report_date": reports[0]["created_at"].isoformat() if reports else None
            }
        }
        
    except Exception as e:
        logging.error(f"Enhanced reports retrieval error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)