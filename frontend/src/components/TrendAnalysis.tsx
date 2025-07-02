import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Hash, 
  Calendar, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Clock,
  Users,
  Eye
} from 'lucide-react'

interface Trend {
  topic: string
  volume: number
  growth: string
  growthType: 'positive' | 'negative' | 'neutral'
  relevance: 'high' | 'medium' | 'low'
  keywords: string[]
  sentiment: number
  category: string
}

interface TrendingHashtag {
  hashtag: string
  posts: number
  growth: string
  platforms: string[]
}

const TrendAnalysis = () => {
  const [trends, setTrends] = useState<Trend[]>([])
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendData()
  }, [])

  const fetchTrendData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTrends: Trend[] = [
        {
          topic: '🤖 AI-Detected: Smart Home Technology',
          volume: 15420,
          growth: '+23%',
          growthType: 'positive',
          relevance: 'high',
          keywords: ['smart thermostat', 'home automation', 'IoT devices'],
          sentiment: 0.8,
          category: 'Technology'
        },
        {
          topic: '🌱 AI-Predicted: Sustainable Building Materials',
          volume: 8930,
          growth: '+18%',
          growthType: 'positive',
          relevance: 'high',
          keywords: ['eco-friendly', 'bamboo flooring', 'recycled materials'],
          sentiment: 0.9,
          category: 'Sustainability'
        },
        {
          topic: '🔧 AI-Trending: DIY Kitchen Renovation',
          volume: 12340,
          growth: '+15%',
          growthType: 'positive',
          relevance: 'medium',
          keywords: ['cabinet painting', 'backsplash', 'countertops'],
          sentiment: 0.7,
          category: 'DIY'
        },
        {
          topic: '🏡 AI-Identified: Outdoor Living Spaces',
          volume: 9870,
          growth: '+28%',
          growthType: 'positive',
          relevance: 'high',
          keywords: ['patio design', 'outdoor kitchen', 'fire pit'],
          sentiment: 0.85,
          category: 'Outdoor'
        }
      ]

      const mockHashtags: TrendingHashtag[] = [
        { hashtag: '#SmartHome', posts: 45200, growth: '+32%', platforms: ['Instagram', 'TikTok'] },
        { hashtag: '#DIYProject', posts: 38900, growth: '+18%', platforms: ['Instagram', 'Pinterest'] },
        { hashtag: '#HomeRenovation', posts: 52100, growth: '+25%', platforms: ['Instagram', 'YouTube'] },
        { hashtag: '#SustainableLiving', posts: 29800, growth: '+41%', platforms: ['Instagram', 'Twitter'] },
        { hashtag: '#OutdoorDesign', posts: 22400, growth: '+19%', platforms: ['Pinterest', 'Instagram'] }
      ]

      setTrends(mockTrends)
      setHashtags(mockHashtags)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching trend data:', error)
      setLoading(false)
    }
  }

  const categories = ['all', 'Technology', 'Sustainability', 'DIY', 'Outdoor']

  const filteredTrends = selectedCategory === 'all' 
    ? trends 
    : trends.filter(trend => trend.category === selectedCategory)

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high':
        return 'bg-emerald/10 text-emerald'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return 'text-emerald'
    if (sentiment >= 0.4) return 'text-yellow-600'
    return 'text-red-500'
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-48 bg-gray-200"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">🔥 AI Trend Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered discovery of trending topics and hashtags in home improvement</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
              🤖 Real-time AI Analysis
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              📈 Predictive Insights
            </span>
          </div>
        </div>
        <button className="btn-primary">
          🔄 Refresh AI Trends
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-pill ${
              selectedCategory === category ? 'category-pill-active' : 'category-pill-inactive'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Trending Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend, index) => (
          <div key={index} className="card group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(trend.relevance)}`}>
                  {trend.relevance} relevance
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ArrowUpRight className="w-4 h-4 text-emerald" />
                <span className="text-sm font-medium text-emerald">{trend.growth}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-primary-text mb-2">{trend.topic}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Volume</span>
                <span className="font-medium text-primary-text">{trend.volume.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Sentiment</span>
                <span className={`font-medium ${getSentimentColor(trend.sentiment)}`}>
                  {(trend.sentiment * 100).toFixed(0)}% Positive
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-secondary-text text-sm">Category</span>
                <span className="font-medium text-primary-text">{trend.category}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-primary-text mb-2">Related Keywords:</h4>
              <div className="flex flex-wrap gap-1">
                {trend.keywords.map((keyword, keyIndex) => (
                  <span 
                    key={keyIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full btn-secondary text-sm">Analyze Opportunity</button>
          </div>
        ))}
      </div>

      {/* Trending Hashtags */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-text">Trending Hashtags</h2>
          <button className="btn-secondary text-sm">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hashtags.map((hashtag, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-emerald" />
                  <span className="font-bold text-primary-text">{hashtag.hashtag}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald" />
                  <span className="text-xs font-medium text-emerald">{hashtag.growth}</span>
                </div>
              </div>
              
              <p className="text-secondary-text text-sm mb-2">
                {hashtag.posts.toLocaleString()} posts
              </p>
              
              <div className="flex flex-wrap gap-1">
                {hashtag.platforms.map((platform, platformIndex) => (
                  <span 
                    key={platformIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Opportunities */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary-text mb-6">Content Opportunities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-emerald/5 border border-emerald/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-emerald" />
              <h3 className="font-bold text-primary-text">High-Impact Opportunity</h3>
            </div>
            <h4 className="font-medium text-primary-text mb-2">Smart Home Integration Content</h4>
            <p className="text-secondary-text text-sm mb-3">
              Create tutorials showing how to integrate smart devices with traditional home improvement projects.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-emerald" />
                <span className="text-emerald">High Growth</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-emerald" />
                <span className="text-emerald">Large Audience</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-primary-text">Seasonal Opportunity</h3>
            </div>
            <h4 className="font-medium text-primary-text mb-2">Outdoor Living Preparation</h4>
            <p className="text-secondary-text text-sm mb-3">
              Spring season driving interest in outdoor spaces. Perfect timing for patio and garden content.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-600">Seasonal Peak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-600">High Visibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Timeline */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary-text mb-6">Trend Timeline</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-secondary-text">Interactive trend timeline</p>
            <p className="text-sm text-muted-text">Track trend evolution over time</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendAnalysis
