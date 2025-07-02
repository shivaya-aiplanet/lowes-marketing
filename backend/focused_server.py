"""Focused FastAPI server for 3 AI agents: Competitor Analysis, Lowe's Analysis, Strategy Generation."""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import logging
import asyncio
from datetime import datetime
import uuid

from agents.focused_crew_manager import FocusedCrewManager

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Lowe's AI Social Media Analytics - Focused", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the focused crew manager
crew_manager = FocusedCrewManager()

# Global storage for results (in production, use a database)
analysis_results = {}
active_tasks = {}

# Pydantic models
class AnalysisRequest(BaseModel):
    analysis_type: str  # "competitors", "lowes", "strategy", "full"

class AnalysisResponse(BaseModel):
    task_id: str
    status: str
    message: str

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Lowe's AI Social Media Analytics - Focused API",
        "version": "1.0.0",
        "agents": ["competitor_analysis", "lowes_performance", "strategy_generation"]
    }

@app.get("/api/status")
async def get_status():
    """Get system status."""
    return {
        "status": "operational",
        "agents": crew_manager.get_agents_status(),
        "active_tasks": len(active_tasks),
        "completed_analyses": len(analysis_results)
    }

@app.post("/api/analyze/competitors")
async def analyze_competitors(background_tasks: BackgroundTasks):
    """Start competitor analysis using web search."""
    task_id = str(uuid.uuid4())
    
    active_tasks[task_id] = {
        "type": "competitor_analysis",
        "status": "running",
        "started_at": datetime.now().isoformat()
    }
    
    # Run analysis in background
    background_tasks.add_task(run_competitor_analysis, task_id)
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": "Competitor analysis started. This will take 2-3 minutes.",
        "estimated_completion": "2-3 minutes"
    }

@app.post("/api/analyze/lowes")
async def analyze_lowes(background_tasks: BackgroundTasks):
    """Start Lowe's performance analysis using web search."""
    task_id = str(uuid.uuid4())
    
    active_tasks[task_id] = {
        "type": "lowes_performance",
        "status": "running", 
        "started_at": datetime.now().isoformat()
    }
    
    # Run analysis in background
    background_tasks.add_task(run_lowes_analysis, task_id)
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": "Lowe's performance analysis started. This will take 2-3 minutes.",
        "estimated_completion": "2-3 minutes"
    }

@app.post("/api/analyze/strategy")
async def generate_strategy(background_tasks: BackgroundTasks):
    """Generate strategy and content recommendations."""
    task_id = str(uuid.uuid4())

    active_tasks[task_id] = {
        "type": "strategy_generation",
        "status": "running",
        "started_at": datetime.now().isoformat()
    }

    # Run strategy generation in background
    background_tasks.add_task(run_strategy_generation, task_id)

    return {
        "task_id": task_id,
        "status": "started",
        "message": "Strategy generation started. This will take 1-2 minutes.",
        "estimated_completion": "1-2 minutes"
    }

@app.post("/api/analyze/campaigns")
async def analyze_campaigns(background_tasks: BackgroundTasks):
    """Start ad campaign analysis using mock APIs."""
    task_id = str(uuid.uuid4())

    active_tasks[task_id] = {
        "type": "campaign_analysis",
        "status": "running",
        "started_at": datetime.now().isoformat()
    }

    # Run analysis in background
    background_tasks.add_task(run_campaign_analysis, task_id)

    return {
        "task_id": task_id,
        "status": "started",
        "message": "Ad campaign analysis started. This will take 2-3 minutes.",
        "estimated_completion": "2-3 minutes"
    }

@app.post("/api/analyze/full")
async def full_analysis(background_tasks: BackgroundTasks):
    """Run complete analysis: competitors + Lowe's + strategy."""
    task_id = str(uuid.uuid4())
    
    active_tasks[task_id] = {
        "type": "full_analysis",
        "status": "running",
        "started_at": datetime.now().isoformat()
    }
    
    # Run full analysis in background
    background_tasks.add_task(run_full_analysis, task_id)
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": "Full analysis started. This will take 5-7 minutes.",
        "estimated_completion": "5-7 minutes"
    }

@app.get("/api/results/{task_id}")
async def get_results(task_id: str):
    """Get analysis results by task ID."""
    
    # Check if task is still running
    if task_id in active_tasks:
        return {
            "task_id": task_id,
            "status": active_tasks[task_id]["status"],
            "message": "Analysis still running...",
            "started_at": active_tasks[task_id]["started_at"]
        }
    
    # Check if results are available
    if task_id in analysis_results:
        return {
            "task_id": task_id,
            "status": "completed",
            "results": analysis_results[task_id]
        }
    
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/results/latest/{analysis_type}")
async def get_latest_results(analysis_type: str):
    """Get latest results for a specific analysis type."""
    
    # Find latest result of the specified type
    latest_result = None
    latest_time = None
    
    for task_id, result in analysis_results.items():
        if result.get("analysis_type") == analysis_type:
            result_time = datetime.fromisoformat(result.get("timestamp", ""))
            if latest_time is None or result_time > latest_time:
                latest_time = result_time
                latest_result = result
    
    if latest_result:
        return {
            "status": "success",
            "analysis_type": analysis_type,
            "results": latest_result
        }
    
    return {
        "status": "not_found",
        "message": f"No results found for analysis type: {analysis_type}"
    }

# Background task functions
async def run_competitor_analysis(task_id: str):
    """Background task for competitor analysis."""
    try:
        logger.info(f"Starting competitor analysis for task {task_id}")
        result = await crew_manager.analyze_competitors()
        
        # Store result
        analysis_results[task_id] = result
        
        # Remove from active tasks
        if task_id in active_tasks:
            del active_tasks[task_id]
            
        logger.info(f"Competitor analysis completed for task {task_id}")
        
    except Exception as e:
        logger.error(f"Competitor analysis failed for task {task_id}: {e}")
        analysis_results[task_id] = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        if task_id in active_tasks:
            del active_tasks[task_id]

async def run_lowes_analysis(task_id: str):
    """Background task for Lowe's analysis."""
    try:
        logger.info(f"Starting Lowe's analysis for task {task_id}")
        result = await crew_manager.analyze_lowes_performance()
        
        # Store result
        analysis_results[task_id] = result
        
        # Remove from active tasks
        if task_id in active_tasks:
            del active_tasks[task_id]
            
        logger.info(f"Lowe's analysis completed for task {task_id}")
        
    except Exception as e:
        logger.error(f"Lowe's analysis failed for task {task_id}: {e}")
        analysis_results[task_id] = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        if task_id in active_tasks:
            del active_tasks[task_id]

async def run_strategy_generation(task_id: str):
    """Background task for strategy generation."""
    try:
        logger.info(f"Starting strategy generation for task {task_id}")
        
        # Get latest competitor and Lowe's data if available
        competitor_data = ""
        lowes_data = ""
        
        for result in analysis_results.values():
            if result.get("analysis_type") == "competitor_analysis":
                competitor_data = result.get("result", "")
            elif result.get("analysis_type") == "lowes_performance":
                lowes_data = result.get("result", "")
        
        result = await crew_manager.generate_strategy_and_content(competitor_data, lowes_data)
        
        # Store result
        analysis_results[task_id] = result
        
        # Remove from active tasks
        if task_id in active_tasks:
            del active_tasks[task_id]
            
        logger.info(f"Strategy generation completed for task {task_id}")
        
    except Exception as e:
        logger.error(f"Strategy generation failed for task {task_id}: {e}")
        analysis_results[task_id] = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        if task_id in active_tasks:
            del active_tasks[task_id]

async def run_campaign_analysis(task_id: str):
    """Background task for ad campaign analysis."""
    try:
        logger.info(f"Starting ad campaign analysis for task {task_id}")
        result = await crew_manager.analyze_ad_campaigns()

        # Store result
        analysis_results[task_id] = result

        # Remove from active tasks
        if task_id in active_tasks:
            del active_tasks[task_id]

        logger.info(f"Ad campaign analysis completed for task {task_id}")

    except Exception as e:
        logger.error(f"Ad campaign analysis failed for task {task_id}: {e}")
        analysis_results[task_id] = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        if task_id in active_tasks:
            del active_tasks[task_id]

async def run_full_analysis(task_id: str):
    """Background task for full analysis."""
    try:
        logger.info(f"Starting full analysis for task {task_id}")
        result = await crew_manager.execute_full_analysis()
        
        # Store result
        analysis_results[task_id] = result
        
        # Remove from active tasks
        if task_id in active_tasks:
            del active_tasks[task_id]
            
        logger.info(f"Full analysis completed for task {task_id}")
        
    except Exception as e:
        logger.error(f"Full analysis failed for task {task_id}: {e}")
        analysis_results[task_id] = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        if task_id in active_tasks:
            del active_tasks[task_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
