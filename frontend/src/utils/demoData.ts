// Demo data generator for POC - simulates AI-generated insights
export const generateAIInsight = () => {
  const insights = [
    {
      type: 'trend',
      title: '🔥 AI Trend Alert',
      message: 'Smart home integration searches increased 45% this week. Competitors are missing this opportunity.',
      action: 'Create smart home + DIY hybrid content',
      confidence: 92
    },
    {
      type: 'competitor',
      title: '🎯 Competitive Gap Found',
      message: 'Home Depot focuses 70% on contractors. DIY enthusiasts are underserved market segment.',
      action: 'Target DIY beginners with tutorial content',
      confidence: 88
    },
    {
      type: 'performance',
      title: '📈 Optimization Opportunity',
      message: 'Your Tuesday 2-4 PM posts get 3.2x more engagement than average posting times.',
      action: 'Shift 40% of content to peak engagement windows',
      confidence: 95
    },
    {
      type: 'content',
      title: '🎬 Content Strategy Insight',
      message: 'Video content performs 4x better than static images. Time-lapse videos get highest engagement.',
      action: 'Prioritize video production, especially time-lapse tutorials',
      confidence: 91
    },
    {
      type: 'seasonal',
      title: '🌸 Seasonal Prediction',
      message: 'AI predicts 60% increase in outdoor project searches next month based on weather patterns.',
      action: 'Prepare outdoor living content campaign for March launch',
      confidence: 87
    }
  ]
  
  return insights[Math.floor(Math.random() * insights.length)]
}

export const generateCompetitorInsight = () => {
  const competitors = ['Home Depot', 'Menards', 'Wayfair', 'Ace Hardware']
  const insights = [
    'is missing smart home integration content - 45% opportunity gap',
    'posts 25% less video content than optimal engagement rates suggest',
    'focuses heavily on professional contractors, missing DIY enthusiast segment',
    'has inconsistent posting schedule, missing peak engagement windows',
    'lacks seasonal content strategy for outdoor projects'
  ]
  
  const competitor = competitors[Math.floor(Math.random() * competitors.length)]
  const insight = insights[Math.floor(Math.random() * insights.length)]
  
  return `${competitor} ${insight}`
}

export const generateTrendPrediction = () => {
  const trends = [
    {
      topic: 'Smart Home DIY Integration',
      growth: '+45%',
      confidence: 92,
      timeframe: 'Next 30 days'
    },
    {
      topic: 'Sustainable Building Materials',
      growth: '+38%',
      confidence: 89,
      timeframe: 'Next 60 days'
    },
    {
      topic: 'Outdoor Kitchen Projects',
      growth: '+52%',
      confidence: 94,
      timeframe: 'Next 45 days'
    },
    {
      topic: 'Energy-Efficient Home Upgrades',
      growth: '+41%',
      confidence: 87,
      timeframe: 'Next 90 days'
    }
  ]
  
  return trends[Math.floor(Math.random() * trends.length)]
}

export const generateContentRecommendation = () => {
  const recommendations = [
    {
      type: 'Video Tutorial',
      topic: 'Smart Thermostat Installation for Beginners',
      reasoning: 'High search volume + low competitor coverage = opportunity',
      expectedEngagement: '+340%',
      priority: 'High'
    },
    {
      type: 'Carousel Post',
      topic: 'Before & After Kitchen Cabinet Painting',
      reasoning: 'Carousel posts get 25% more saves than single images',
      expectedEngagement: '+180%',
      priority: 'Medium'
    },
    {
      type: 'Time-lapse Video',
      topic: 'Deck Building in 60 Seconds',
      reasoning: 'Time-lapse content gets 4x more shares than regular videos',
      expectedEngagement: '+420%',
      priority: 'High'
    },
    {
      type: 'Educational Series',
      topic: 'DIY 101: Essential Tools for Beginners',
      reasoning: 'Fills competitor gap in beginner-friendly content',
      expectedEngagement: '+250%',
      priority: 'High'
    }
  ]
  
  return recommendations[Math.floor(Math.random() * recommendations.length)]
}

export const simulateAIProcessing = (callback: (result: any) => void, delay: number = 3000) => {
  setTimeout(() => {
    const result = {
      insights: [
        generateAIInsight().message,
        generateCompetitorInsight(),
        generateTrendPrediction().topic + ' trending ' + generateTrendPrediction().growth
      ],
      recommendations: [
        generateContentRecommendation().topic,
        generateAIInsight().action,
        generateContentRecommendation().reasoning
      ],
      confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
      processingTime: Math.floor(Math.random() * 30) + 15 // 15-45 seconds
    }
    callback(result)
  }, delay)
}

// Real-time demo data updates
export const startDemoDataStream = (callback: (data: any) => void) => {
  const interval = setInterval(() => {
    const demoUpdate = {
      timestamp: new Date().toISOString(),
      type: 'ai_insight',
      data: generateAIInsight()
    }
    callback(demoUpdate)
  }, 10000) // Update every 10 seconds
  
  return interval
}
