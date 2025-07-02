import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Eye,
  Heart,
  MessageCircle,
  Share,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface DashboardStats {
  totalPosts: number
  totalEngagement: number
  avgEngagementRate: number
  topPlatform: string
  growthRate: string
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API call
      setStats({
        totalPosts: 156,
        totalEngagement: 45200,
        avgEngagementRate: 4.2,
        topPlatform: 'Instagram',
        growthRate: '+12%'
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      change: '+8%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'emerald'
    },
    {
      title: 'Total Engagement',
      value: stats?.totalEngagement || 0,
      change: '+15%',
      changeType: 'positive',
      icon: Heart,
      color: 'emerald'
    },
    {
      title: 'Avg Engagement Rate',
      value: `${stats?.avgEngagementRate || 0}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: 'Top Platform',
      value: stats?.topPlatform || 'Instagram',
      change: 'Leading',
      changeType: 'neutral',
      icon: Target,
      color: 'emerald'
    }
  ]

  const recentPosts = [
    {
      id: 1,
      platform: 'Instagram',
      content: 'Transform your kitchen with our new cabinet collection! 🏠✨',
      engagement: 1250,
      likes: 890,
      comments: 156,
      shares: 204,
      time: '2 hours ago'
    },
    {
      id: 2,
      platform: 'Facebook',
      content: 'Spring is here! Get your garden ready with premium soil...',
      engagement: 890,
      likes: 645,
      comments: 89,
      shares: 156,
      time: '5 hours ago'
    },
    {
      id: 3,
      platform: 'Instagram',
      content: 'DIY deck building made easy! Check out our guide 🔨',
      engagement: 2100,
      likes: 1456,
      comments: 234,
      shares: 410,
      time: '1 day ago'
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-text text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-primary-text mt-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald mr-1" />
                    ) : stat.changeType === 'negative' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    ) : null}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-emerald' :
                      stat.changeType === 'negative' ? 'text-red-500' :
                      'text-secondary-text'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-emerald/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-emerald" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Posts Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-text">Recent Posts Performance</h2>
          <button className="btn-secondary text-sm">View All</button>
        </div>
        
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-emerald/10 text-emerald text-xs font-medium rounded-full">
                    {post.platform}
                  </span>
                  <span className="text-xs text-secondary-text">{post.time}</span>
                </div>
                <p className="text-primary-text font-medium mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center space-x-4 text-sm text-secondary-text">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="w-4 h-4" />
                    <span>{post.shares}</span>
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

      {/* AI Insights Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🤖 AI-Generated Insights</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            Live Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Content Opportunity</h3>
            <p className="text-blue-800 text-sm">
              AI detected a 45% increase in "smart home DIY" searches. Competitors are missing this trend -
              perfect opportunity for Lowe's to dominate this space with educational content.
            </p>
          </div>

          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <h3 className="font-semibold text-green-900 mb-2">📈 Performance Insight</h3>
            <p className="text-green-800 text-sm">
              Your Tuesday 2-4 PM posts get 3.2x more engagement. AI recommends shifting 40% of your
              content schedule to these peak windows for maximum reach.
            </p>
          </div>

          <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
            <h3 className="font-semibold text-purple-900 mb-2">🏆 Competitive Edge</h3>
            <p className="text-purple-800 text-sm">
              Home Depot focuses 70% on contractors. AI analysis shows DIY enthusiasts are underserved -
              target this audience with beginner-friendly tutorials.
            </p>
          </div>

          <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
            <h3 className="font-semibold text-orange-900 mb-2">🎬 Content Strategy</h3>
            <p className="text-orange-800 text-sm">
              Video content performs 4x better than images. AI suggests creating time-lapse project videos
              and step-by-step tutorials for maximum engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Analyze Competitors</h3>
          <p className="text-gray-600 text-sm mb-4">Get AI insights on competitor strategies and performance</p>
          <button
            onClick={() => {
              alert('🤖 AI Analysis Started!\n\nAnalyzing competitor strategies...\nThis would normally take 30-60 seconds.\n\nCheck the AI Agents tab to see results!')
            }}
            className="btn-primary w-full"
          >
            🚀 Start AI Analysis
          </button>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Trend Research</h3>
          <p className="text-gray-600 text-sm mb-4">Discover trending topics with AI-powered analysis</p>
          <button
            onClick={() => {
              alert('🔥 AI Trend Analysis Started!\n\n• Smart Home DIY +45% growth\n• Sustainable Materials +38% growth\n• Outdoor Living +52% growth\n\nCheck the Trends tab for detailed insights!')
            }}
            className="btn-primary w-full"
          >
            🔍 Find AI Trends
          </button>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Generate Content</h3>
          <p className="text-gray-600 text-sm mb-4">Create AI-powered social media content</p>
          <button
            onClick={() => {
              alert('✨ AI Content Generator Ready!\n\nClick the "Content Generator" tab to:\n• Generate post ideas\n• Create captions\n• Get hashtag suggestions\n• Optimize for engagement!')
            }}
            className="btn-primary w-full"
          >
            ✨ Generate Content
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
