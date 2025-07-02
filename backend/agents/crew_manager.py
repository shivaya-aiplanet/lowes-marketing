"""Crew Manager for coordinating all CrewAI agents."""

import os
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import uuid

from .trend_research_agent import TrendResearchAgent
from .performance_agent import PerformanceAnalysisAgent
from .strategy_agent import StrategyRecommendationAgent
from .campaign_agent import CampaignAnalysisAgent


class CrewManager:
    """Manager class for coordinating all CrewAI agents and their tasks."""
    
    def __init__(self):
        self.trend_agent = TrendResearchAgent()
        self.performance_agent = PerformanceAnalysisAgent()
        self.strategy_agent = StrategyRecommendationAgent()
        self.campaign_agent = CampaignAnalysisAgent()
        
        # Task tracking
        self.active_tasks = {}
        self.completed_tasks = {}
    
    def get_agents_status(self) -> Dict[str, Any]:
        """Get the status of all agents."""
        return {
            "trend_research_agent": {
                "status": "ready",
                "description": "Monitors competitors and identifies trends",
                "capabilities": ["competitor_analysis", "trend_monitoring", "market_research"]
            },
            "performance_analysis_agent": {
                "status": "ready", 
                "description": "Analyzes internal social media performance",
                "capabilities": ["content_analysis", "audience_insights", "platform_performance"]
            },
            "strategy_recommendation_agent": {
                "status": "ready",
                "description": "Generates strategic recommendations",
                "capabilities": ["content_strategy", "campaign_recommendations", "competitive_strategy"]
            },
            "campaign_analysis_agent": {
                "status": "ready",
                "description": "Analyzes paid advertising performance",
                "capabilities": ["campaign_performance", "audience_analysis", "creative_optimization"]
            }
        }
    
    def start_agent_task(self, agent_type: str, task_description: str, parameters: Dict = None) -> str:
        """Start a specific agent task."""
        task_id = str(uuid.uuid4())
        
        try:
            if agent_type == "trend_research":
                if "competitor_analysis" in task_description.lower():
                    competitors = parameters.get("competitors") if parameters else None
                    result = self.trend_agent.execute_competitor_research(competitors)
                elif "trend_monitoring" in task_description.lower():
                    result = self.trend_agent.execute_trend_monitoring()
                else:
                    result = self.trend_agent.execute_competitor_research()
                    
            elif agent_type == "performance_analysis":
                if "content_performance" in task_description.lower():
                    result = self.performance_agent.analyze_content_performance()
                elif "audience_insights" in task_description.lower():
                    result = self.performance_agent.analyze_audience_insights()
                elif "platform_performance" in task_description.lower():
                    result = self.performance_agent.analyze_platform_performance()
                else:
                    result = self.performance_agent.execute_full_performance_analysis()
                    
            elif agent_type == "strategic_recommendation":
                if "content_strategy" in task_description.lower():
                    result = self.strategy_agent.generate_content_strategy()
                elif "campaign_recommendations" in task_description.lower():
                    result = self.strategy_agent.generate_campaign_recommendations()
                elif "competitive_strategy" in task_description.lower():
                    result = self.strategy_agent.generate_competitive_strategy()
                else:
                    result = self.strategy_agent.execute_comprehensive_strategy()
                    
            elif agent_type == "campaign_analyst":
                if "campaign_performance" in task_description.lower():
                    result = self.campaign_agent.analyze_campaign_performance()
                elif "audience_analysis" in task_description.lower():
                    result = self.campaign_agent.analyze_audience_performance()
                elif "creative_analysis" in task_description.lower():
                    result = self.campaign_agent.analyze_creative_performance()
                else:
                    result = self.campaign_agent.execute_full_campaign_analysis()
            else:
                result = {
                    "status": "error",
                    "error": f"Unknown agent type: {agent_type}"
                }
            
            # Store task result
            self.completed_tasks[task_id] = {
                "task_id": task_id,
                "agent_type": agent_type,
                "task_description": task_description,
                "parameters": parameters,
                "result": result,
                "created_at": datetime.now(),
                "completed_at": datetime.now(),
                "status": "completed"
            }
            
            return task_id
            
        except Exception as e:
            error_result = {
                "status": "error",
                "error": str(e),
                "agent_type": agent_type
            }
            
            self.completed_tasks[task_id] = {
                "task_id": task_id,
                "agent_type": agent_type,
                "task_description": task_description,
                "parameters": parameters,
                "result": error_result,
                "created_at": datetime.now(),
                "completed_at": datetime.now(),
                "status": "failed"
            }
            
            return task_id
    
    def get_task_result(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get the result of a specific task."""
        if task_id in self.completed_tasks:
            return self.completed_tasks[task_id]
        elif task_id in self.active_tasks:
            return {
                "task_id": task_id,
                "status": "running",
                "created_at": self.active_tasks[task_id]["created_at"]
            }
        else:
            return None
    
    def execute_full_workflow(self) -> str:
        """Execute the full crew workflow with all agents."""
        workflow_id = str(uuid.uuid4())
        
        try:
            # Step 1: Trend and Competitor Research
            print("Step 1: Executing Trend and Competitor Research...")
            trend_result = self.trend_agent.execute_competitor_research()
            trend_monitoring = self.trend_agent.execute_trend_monitoring()
            
            # Step 2: Internal Performance Analysis
            print("Step 2: Executing Internal Performance Analysis...")
            performance_result = self.performance_agent.execute_full_performance_analysis()
            
            # Step 3: Campaign Performance Analysis
            print("Step 3: Executing Campaign Performance Analysis...")
            campaign_result = self.campaign_agent.execute_full_campaign_analysis()
            
            # Step 4: Strategic Recommendations
            print("Step 4: Generating Strategic Recommendations...")
            all_data = {
                "competitor_analysis": trend_result,
                "trend_monitoring": trend_monitoring,
                "performance_analysis": performance_result,
                "campaign_analysis": campaign_result
            }
            strategy_result = self.strategy_agent.execute_comprehensive_strategy(all_data)
            
            # Compile full workflow result
            workflow_result = {
                "status": "success",
                "workflow_id": workflow_id,
                "results": {
                    "trend_research": trend_result,
                    "trend_monitoring": trend_monitoring,
                    "performance_analysis": performance_result,
                    "campaign_analysis": campaign_result,
                    "strategic_recommendations": strategy_result
                },
                "summary": {
                    "total_agents_executed": 4,
                    "execution_time": "completed",
                    "key_insights": "Comprehensive analysis completed across all areas"
                }
            }
            
            # Store workflow result
            self.completed_tasks[workflow_id] = {
                "task_id": workflow_id,
                "agent_type": "full_workflow",
                "task_description": "Complete crew workflow execution",
                "result": workflow_result,
                "created_at": datetime.now(),
                "completed_at": datetime.now(),
                "status": "completed"
            }
            
            return workflow_id
            
        except Exception as e:
            error_result = {
                "status": "error",
                "workflow_id": workflow_id,
                "error": str(e)
            }
            
            self.completed_tasks[workflow_id] = {
                "task_id": workflow_id,
                "agent_type": "full_workflow",
                "task_description": "Complete crew workflow execution",
                "result": error_result,
                "created_at": datetime.now(),
                "completed_at": datetime.now(),
                "status": "failed"
            }
            
            return workflow_id
    
    def get_latest_results(self) -> Dict[str, Any]:
        """Get the latest results from all agents."""
        if not self.completed_tasks:
            return {"message": "No completed tasks found"}
        
        # Get the most recent task
        latest_task = max(self.completed_tasks.values(), key=lambda x: x["completed_at"])
        
        return {
            "latest_task": latest_task,
            "total_completed_tasks": len(self.completed_tasks),
            "timestamp": datetime.now().isoformat()
        }
    
    def cancel_task(self, task_id: str) -> bool:
        """Cancel a running task."""
        if task_id in self.active_tasks:
            del self.active_tasks[task_id]
            return True
        return False
    
    def get_workflow_summary(self) -> Dict[str, Any]:
        """Get a summary of all workflow executions."""
        completed_workflows = [
            task for task in self.completed_tasks.values() 
            if task["agent_type"] == "full_workflow"
        ]
        
        agent_task_counts = {}
        for task in self.completed_tasks.values():
            agent_type = task["agent_type"]
            if agent_type not in agent_task_counts:
                agent_task_counts[agent_type] = 0
            agent_task_counts[agent_type] += 1
        
        return {
            "total_workflows_executed": len(completed_workflows),
            "total_tasks_completed": len(self.completed_tasks),
            "agent_task_breakdown": agent_task_counts,
            "last_workflow_execution": completed_workflows[-1]["completed_at"].isoformat() if completed_workflows else None
        }
