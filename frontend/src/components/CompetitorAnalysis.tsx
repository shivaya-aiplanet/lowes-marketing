import { useState, useEffect } from 'react'
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react'

interface Competitor {
  name: string
  followers: number
  engagementRate: number
  postsPerWeek: number
  topPlatform: string
  growth: string
  growthType: 'positive' | 'negative' | 'neutral'
}

const CompetitorAnalysis = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompetitorData()
  }, [])

  const fetchCompetitorData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: Competitor[] = [
        {
          name: 'Home Depot',
          followers: 2500000,
          engagementRate: 3.8,
          postsPerWeek: 12,
          topPlatform: 'Instagram',
          growth: '+8%',
          growthType: 'positive'
        },
        {
          name: 'Menards',
          followers: 850000,
          engagementRate: 4.2,
          postsPerWeek: 8,
          topPlatform: 'Facebook',
          growth: '+5%',
          growthType: 'positive'
        },
        {
          name: 'Wayfair',
          followers: 1200000,
          engagementRate: 5.1,
          postsPerWeek: 15,
          topPlatform: 'Instagram',
          growth: '+12%',
          growthType: 'positive'
        },
        {
          name: 'Ace Hardware',
          followers: 450000,
          engagementRate: 3.2,
          postsPerWeek: 6,
          topPlatform: 'Facebook',
          growth: '+3%',
          growthType: 'positive'
        }
      ]
      
      setCompetitors(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching competitor data:', error)
      setLoading(false)
    }
  }

  const competitorInsights = [
    {
      title: '🤖 AI-Detected Content Gap',
      description: 'Home Depot focuses heavily on professional contractors while missing DIY enthusiast content. AI analysis shows 65% contractor focus vs 35% DIY.',
      impact: 'High',
      opportunity: 'Target DIY segment with beginner-friendly tutorials - potential 40% engagement increase'
    },
    {
      title: '📊 AI Posting Pattern Analysis',
      description: 'Wayfair posts 25% more frequently than average, driving higher engagement. AI detected optimal posting windows they\'re missing.',
      impact: 'Medium',
      opportunity: 'Increase posting frequency during peak hours (2-4 PM) for 30% engagement boost'
    },
    {
      title: '🎬 AI Video Content Insights',
      description: 'Competitors using 40% more video content, especially time-lapse projects. AI shows video gets 4x more engagement than static posts.',
      impact: 'High',
      opportunity: 'Develop video-first content strategy - prioritize time-lapse and tutorial videos'
    },
    {
      title: '🔍 AI Trend Analysis',
      description: 'Smart home integration content is trending +45% but competitors are slow to adopt. AI identifies this as a blue ocean opportunity.',
      impact: 'High',
      opportunity: 'Create smart home + traditional DIY hybrid content to capture emerging market'
    }
  ]

  const topPerformingPosts = [
    {
      competitor: 'Home Depot',
      content: 'Kitchen renovation before & after showcase',
      engagement: 15420,
      platform: 'Instagram',
      contentType: 'Carousel'
    },
    {
      competitor: 'Wayfair',
      content: 'Spring home decor trends 2024',
      engagement: 12890,
      platform: 'Instagram',
      contentType: 'Video'
    },
    {
      competitor: 'Menards',
      content: 'DIY deck building tutorial series',
      engagement: 8950,
      platform: 'YouTube',
      contentType: 'Video'
    }
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-32 bg-gray-200"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI Competitor Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered monitoring and analysis of competitor social media performance</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              ✅ Live AI Monitoring
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              🔄 Auto-Updated Every Hour
            </span>
          </div>
        </div>
        <button className="btn-primary">
          🚀 Run AI Analysis
        </button>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {competitors.map((competitor, index) => (
          <div key={index} className="card group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary-text">{competitor.name}</h3>
              <div className="flex items-center space-x-1">
                {competitor.growthType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  competitor.growthType === 'positive' ? 'text-emerald' : 'text-red-500'
                }`}>
                  {competitor.growth}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Followers</span>
                <span className="font-medium text-primary-text">
                  {(competitor.followers / 1000000).toFixed(1)}M
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Engagement Rate</span>
                <span className="font-medium text-primary-text">{competitor.engagementRate}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Posts/Week</span>
                <span className="font-medium text-primary-text">{competitor.postsPerWeek}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Top Platform</span>
                <span className="font-medium text-primary-text">{competitor.topPlatform}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full btn-secondary text-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Competitive Insights */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🧠 AI-Generated Competitive Insights</h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
            🤖 Powered by CrewAI
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitorInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-primary-text">{insight.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                  insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.impact} Impact
                </span>
              </div>
              <p className="text-secondary-text text-sm mb-3">{insight.description}</p>
              <div className="p-3 bg-emerald/10 rounded-lg">
                <p className="text-emerald text-sm font-medium">Opportunity:</p>
                <p className="text-emerald text-sm">{insight.opportunity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-text">Top Performing Competitor Content</h2>
          <button className="btn-secondary text-sm">View All</button>
        </div>

        <div className="space-y-4">
          {topPerformingPosts.map((post, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-emerald/10 text-emerald text-xs font-medium rounded-full">
                    {post.competitor}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {post.platform}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {post.contentType}
                  </span>
                </div>
                <p className="text-primary-text font-medium mb-2">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-secondary-text">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>High engagement</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending format</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-text">{post.engagement.toLocaleString()}</p>
                <p className="text-xs text-secondary-text">Total Engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Chart Placeholder */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary-text mb-6">Performance Comparison</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-secondary-text">Interactive comparison chart</p>
            <p className="text-sm text-muted-text">Engagement rates, follower growth, and content performance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompetitorAnalysis
