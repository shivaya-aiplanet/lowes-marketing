"""Campaign Performance Analyst Agent using CrewAI."""

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

class CampaignAnalysisAgent:
    """Campaign Performance Analyst Agent for monitoring and analyzing advertising campaigns."""
    
    def __init__(self):
        self.agent = Agent(
            role="Campaign Performance Analyst",
            goal="Monitor paid advertising campaign performance, analyze ROI, and generate optimization recommendations",
            backstory="""You are a data-driven digital marketing analyst specializing in paid advertising performance across 
            multiple platforms. With expertise in Meta Ads, LinkedIn Ads, Google Ads, and other digital advertising platforms, 
            you excel at analyzing campaign metrics, identifying optimization opportunities, and maximizing ROI. Your analytical 
            approach helps businesses understand what's working in their paid campaigns and how to improve performance through 
            data-driven insights and strategic recommendations.""",
            tools=[search_tool],
            llm=llm,
            verbose=True,
            allow_delegation=False
        )
    
    def analyze_campaign_performance(self, campaign_data: Dict = None) -> Dict[str, Any]:
        """Analyze overall campaign performance across platforms."""
        try:
            performance_task = Task(
                description=f"""
                Analyze paid advertising campaign performance for Lowe's across all platforms.
                
                Campaign data: {campaign_data if campaign_data else "Use available campaign metrics"}
                
                Analyze key metrics:
                1. Return on Ad Spend (ROAS) and ROI analysis
                2. Cost per acquisition (CPA) and conversion rates
                3. Click-through rates (CTR) and engagement metrics
                4. Impression share and reach analysis
                5. Audience targeting effectiveness
                6. Creative performance and A/B test results
                7. Budget allocation efficiency
                8. Platform-specific performance comparison
                
                Focus on:
                - Identifying top-performing campaigns and why they succeed
                - Spotting underperforming campaigns and optimization opportunities
                - Budget reallocation recommendations
                - Audience targeting improvements
                - Creative optimization suggestions
                - Seasonal performance patterns
                
                Provide specific, actionable optimization recommendations.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON performance report containing:
                - performance_overview: Key metrics and trends across all campaigns
                - top_performers: Best performing campaigns with success factors
                - underperformers: Poor performing campaigns with improvement areas
                - roi_analysis: Detailed return on investment breakdown
                - optimization_opportunities: Specific areas for improvement
                - budget_recommendations: How to reallocate spend for better results
                - audience_insights: Target audience performance and suggestions
                - creative_analysis: Which ad creatives work best and why"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[performance_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "campaign_analysis",
                "task_type": "performance_analysis",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "campaign_analysis",
                "task_type": "performance_analysis",
                "error": str(e)
            }
    
    def analyze_audience_performance(self) -> Dict[str, Any]:
        """Analyze audience targeting and segmentation performance."""
        try:
            audience_task = Task(
                description="""
                Analyze audience targeting performance and effectiveness across Lowe's paid campaigns.
                
                Analyze:
                1. Demographic performance (age, gender, location, income)
                2. Interest-based targeting effectiveness
                3. Behavioral targeting results
                4. Lookalike audience performance
                5. Custom audience engagement
                6. Retargeting campaign effectiveness
                7. Cross-platform audience overlap
                8. Audience lifetime value analysis
                
                Identify:
                - Highest converting audience segments
                - Most cost-effective targeting strategies
                - Audience expansion opportunities
                - Underperforming segments to exclude
                - Optimal audience size and reach
                - Seasonal audience behavior patterns
                
                Provide recommendations for audience strategy optimization.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON audience analysis containing:
                - audience_performance: Detailed performance by segment
                - top_converting_segments: Best performing audience groups
                - targeting_effectiveness: Which targeting methods work best
                - expansion_opportunities: New audiences to test
                - optimization_recommendations: How to improve targeting
                - exclusion_suggestions: Audiences to avoid or exclude
                - seasonal_insights: How audience behavior changes over time
                - budget_allocation: How to distribute spend across audiences"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[audience_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "campaign_analysis",
                "task_type": "audience_analysis",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "campaign_analysis",
                "task_type": "audience_analysis",
                "error": str(e)
            }
    
    def analyze_creative_performance(self) -> Dict[str, Any]:
        """Analyze ad creative performance and optimization opportunities."""
        try:
            creative_task = Task(
                description="""
                Analyze ad creative performance across all Lowe's paid campaigns.
                
                Analyze creative elements:
                1. Image vs video performance comparison
                2. Headline and copy effectiveness
                3. Call-to-action (CTA) button performance
                4. Color scheme and visual design impact
                5. Product showcase vs lifestyle imagery
                6. Seasonal creative performance
                7. Brand consistency and recognition
                8. Mobile vs desktop creative optimization
                
                Test and compare:
                - Different creative formats and styles
                - Messaging approaches and value propositions
                - Visual elements and design choices
                - Seasonal and trending creative themes
                - Product-focused vs brand-focused creatives
                
                Provide creative optimization recommendations and best practices.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON creative analysis containing:
                - creative_performance: Performance metrics by creative type
                - top_performing_creatives: Best ads with success factors
                - format_analysis: Which creative formats work best
                - messaging_insights: Most effective copy and headlines
                - visual_recommendations: Design and imagery best practices
                - cta_optimization: Most effective call-to-action strategies
                - seasonal_creative_trends: What works during different seasons
                - optimization_guidelines: Creative best practices and standards"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[creative_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "campaign_analysis",
                "task_type": "creative_analysis",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "campaign_analysis",
                "task_type": "creative_analysis",
                "error": str(e)
            }
    
    def generate_optimization_recommendations(self, all_campaign_data: Dict = None) -> Dict[str, Any]:
        """Generate comprehensive campaign optimization recommendations."""
        try:
            optimization_task = Task(
                description=f"""
                Generate comprehensive optimization recommendations for Lowe's paid advertising campaigns.
                
                Campaign data: {all_campaign_data if all_campaign_data else "Use comprehensive campaign analysis"}
                
                Provide optimization recommendations for:
                1. Budget allocation and bid strategy optimization
                2. Audience targeting refinements and expansions
                3. Creative optimization and A/B testing priorities
                4. Campaign structure and organization improvements
                5. Landing page and conversion optimization
                6. Seasonal campaign planning and adjustments
                7. Platform-specific optimization strategies
                8. Performance monitoring and reporting improvements
                
                Prioritize recommendations by:
                - Potential impact on ROI and performance
                - Implementation difficulty and resource requirements
                - Timeline for expected results
                - Risk level and testing requirements
                
                Provide detailed implementation plans with timelines and success metrics.
                """,
                agent=self.agent,
                expected_output="""A comprehensive JSON optimization plan containing:
                - priority_optimizations: Top recommendations ranked by impact
                - budget_optimization: How to reallocate spend for better results
                - targeting_improvements: Audience and targeting refinements
                - creative_optimization: Ad creative improvement strategies
                - testing_roadmap: A/B testing priorities and schedules
                - implementation_timeline: When and how to implement changes
                - success_metrics: How to measure optimization effectiveness
                - risk_assessment: Potential risks and mitigation strategies"""
            )
            
            crew = Crew(agents=[self.agent], tasks=[optimization_task], verbose=True)
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "campaign_analysis",
                "task_type": "optimization_recommendations",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "campaign_analysis",
                "task_type": "optimization_recommendations",
                "error": str(e)
            }
    
    def execute_full_campaign_analysis(self) -> Dict[str, Any]:
        """Execute comprehensive campaign analysis across all areas."""
        try:
            # Create comprehensive analysis tasks
            performance_task = Task(
                description="Analyze overall campaign performance and ROI",
                agent=self.agent,
                expected_output="Campaign performance analysis with optimization opportunities"
            )
            
            audience_task = Task(
                description="Analyze audience targeting effectiveness",
                agent=self.agent,
                expected_output="Audience performance insights and targeting recommendations"
            )
            
            creative_task = Task(
                description="Analyze ad creative performance and optimization",
                agent=self.agent,
                expected_output="Creative performance analysis and design recommendations"
            )
            
            crew = Crew(
                agents=[self.agent],
                tasks=[performance_task, audience_task, creative_task],
                verbose=True
            )
            
            result = crew.kickoff()
            
            return {
                "status": "success",
                "agent_type": "campaign_analysis",
                "task_type": "full_analysis",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "agent_type": "campaign_analysis",
                "task_type": "full_analysis",
                "error": str(e)
            }
