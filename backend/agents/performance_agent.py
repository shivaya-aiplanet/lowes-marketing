"""Internal Performance Analysis Agent using CrewAI."""

import os
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv
from typing import Dict, List, Any
import json

load_dotenv()

# Initialize Azure OpenAI
llm = AzureChatOpenAI(
    azure_deployment=os.getenv("AZURE_DEPLOYMENT_NAME", "intern-gpt4"),
    azure_endpoint=os.getenv("AZURE_ENDPOINT"),
    api_key=os.getenv("AZURE_API_KEY"),
    api_version=os.getenv("AZURE_API_VERSION", "2023-05-15"),
    temperature=0.3,
    model_name="gpt-4"
)

# Initialize tools
search_tool = SerperDevTool(api_key=os.getenv("SERPAPI_KEY"))

class PerformanceAnalysisAgent:
    """Internal Performance Analysis Agent for analyzing Lowe's social media performance."""
    
    def __init__(self):
        self.agent = Agent(
            role="Internal Performance Analysis Specialist",
            goal="Analyze Lowe's historical social media posts, track engagement patterns, and identify high-performing content",
            backstory="""You are a data-driven social media analyst with expertise in performance metrics and content optimization. 
            You specialize in analyzing engagement patterns, identifying content that resonates with audiences, and providing 
            actionable insights for content strategy improvement. Your analytical skills help identify what works and what 
            doesn't in Lowe's social media presence, enabling data-driven decision making for future content.""",
            tools=[search_tool],
            llm=llm,
            verbose=True,
            allow_delegation=False
        )
    
    def analyze_content_performance(self) -> Dict[str, Any]:
        """Analyze Lowe's content performance across platforms."""
        try:
            performance_task = Task(
                description="""
                Analyze Lowe's social media content performance across all platforms.
                
                Focus on:
                1. Engagement rate analysis (likes, comments, shares, saves)
                2. Content type performance (images, videos, carousels, stories)
                3. Posting time optimization analysis
                4. Hashtag performance and effectiveness
                5. Caption length and style impact
                6. Seasonal content performance patterns
                7. Product category performance comparison
                8. Audience response patterns and sentiment
                
                Identify:
                - Top performing content themes and formats
                - Optimal posting times and frequency
                - Most effective hashtag strategies
                - Content that drives highest engagement
                - Underperforming content patterns to avoid
                
                Provide specific recommendations for content optimization.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON report containing:
                - performance_metrics: Detailed engagement analysis
                - top_performing_content: Best performing posts and why
                - content_insights: What content types work best
                - timing_analysis: Optimal posting schedule
                - hashtag_performance: Most effective hashtags
                - audience_engagement: Response patterns and preferences
                - optimization_recommendations: Specific improvement actions"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[performance_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "performance_analysis",
                "task_type": "content_performance",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "performance_analysis",
                "task_type": "content_performance", 
                "error": str(e)
            }
    
    def analyze_audience_insights(self) -> Dict[str, Any]:
        """Analyze audience demographics and behavior patterns."""
        try:
            audience_task = Task(
                description="""
                Analyze Lowe's social media audience demographics, behavior patterns, and preferences.
                
                Research and analyze:
                1. Audience demographics (age, gender, location, interests)
                2. Peak activity times and engagement patterns
                3. Content preferences by audience segment
                4. Device usage patterns (mobile vs desktop)
                5. Customer journey touchpoints on social media
                6. Audience growth trends and acquisition sources
                7. Engagement quality vs quantity analysis
                8. Audience sentiment and brand perception
                
                Identify:
                - Primary and secondary audience segments
                - Content preferences for each segment
                - Optimal engagement strategies
                - Opportunities for audience growth
                - Potential new audience segments to target
                
                Provide recommendations for audience-specific content strategies.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON report containing:
                - audience_demographics: Detailed demographic breakdown
                - behavior_patterns: How audience interacts with content
                - segment_analysis: Different audience segments and preferences
                - engagement_insights: What drives audience interaction
                - growth_opportunities: Potential for audience expansion
                - content_preferences: What content each segment prefers
                - strategic_recommendations: Audience-specific strategies"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[audience_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "performance_analysis",
                "task_type": "audience_insights",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "performance_analysis",
                "task_type": "audience_insights",
                "error": str(e)
            }
    
    def analyze_platform_performance(self) -> Dict[str, Any]:
        """Analyze performance across different social media platforms."""
        try:
            platform_task = Task(
                description="""
                Compare and analyze Lowe's performance across different social media platforms.
                
                Analyze each platform:
                1. Instagram: Visual content performance, Stories vs Posts, Reels engagement
                2. Facebook: Community engagement, event promotion, customer service
                3. Twitter: Real-time engagement, customer support, trending participation
                4. LinkedIn: B2B content, professional audience, thought leadership
                5. YouTube: Video content performance, tutorial engagement, subscriber growth
                6. Pinterest: DIY project pins, seasonal content, shopping integration
                7. TikTok: Short-form video trends, viral content potential
                
                Compare:
                - Engagement rates across platforms
                - Content format effectiveness per platform
                - Audience behavior differences
                - ROI and conversion potential
                - Resource allocation efficiency
                
                Provide platform-specific optimization strategies.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON report containing:
                - platform_comparison: Performance metrics across platforms
                - platform_strengths: What works best on each platform
                - content_optimization: Platform-specific content strategies
                - resource_allocation: Where to focus efforts and budget
                - cross_platform_synergies: How to leverage platforms together
                - growth_opportunities: Platforms with expansion potential
                - strategic_recommendations: Platform-specific action plans"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[platform_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "performance_analysis",
                "task_type": "platform_performance",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "performance_analysis",
                "task_type": "platform_performance",
                "error": str(e)
            }
    
    def execute_full_performance_analysis(self) -> Dict[str, Any]:
        """Execute comprehensive performance analysis."""
        try:
            # Create all analysis tasks
            content_task = Task(
                description="Analyze content performance and engagement patterns",
                agent=self.agent,
                expected_output="Content performance analysis with recommendations"
            )
            
            audience_task = Task(
                description="Analyze audience demographics and behavior",
                agent=self.agent,
                expected_output="Audience insights and segmentation analysis"
            )
            
            platform_task = Task(
                description="Compare performance across social media platforms",
                agent=self.agent,
                expected_output="Platform-specific performance analysis and strategies"
            )
            
            crew = Crew(
                agents=[self.agent],
                tasks=[content_task, audience_task, platform_task],
                verbose=True
            )
            
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "performance_analysis",
                "task_type": "full_analysis",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "performance_analysis",
                "task_type": "full_analysis",
                "error": str(e)
            }
