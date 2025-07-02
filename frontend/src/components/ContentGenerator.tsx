import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  RefreshCw, 
  TrendingUp,
  Target,
  Calendar,
  Hash,
  Image,
  Video,
  FileText,
  Lightbulb
} from 'lucide-react'

interface ContentIdea {
  id: string
  type: 'post' | 'video' | 'carousel' | 'story'
  title: string
  description: string
  caption: string
  hashtags: string[]
  platform: string[]
  trendBased: boolean
  engagementPrediction: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const ContentGenerator = () => {
  const [generatedContent, setGeneratedContent] = useState<ContentIdea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTrends, setSelectedTrends] = useState<string[]>([])
  const [contentType, setContentType] = useState('all')
  const [customPrompt, setCustomPrompt] = useState('')

  const availableTrends = [
    'Smart Home DIY',
    'Sustainable Materials',
    'Outdoor Living',
    'Kitchen Renovation',
    'Energy Efficiency',
    'Small Space Solutions',
    'Seasonal Projects',
    'Tool Reviews'
  ]

  const contentTypes = [
    { id: 'all', name: 'All Content', icon: Sparkles },
    { id: 'post', name: 'Social Posts', icon: FileText },
    { id: 'video', name: 'Video Ideas', icon: Video },
    { id: 'carousel', name: 'Carousel Posts', icon: Image },
    { id: 'story', name: 'Story Content', icon: Hash }
  ]

  const generateAIContent = async () => {
    setIsGenerating(true)
    
    // Simulate AI content generation
    setTimeout(() => {
      const mockContent: ContentIdea[] = [
        {
          id: '1',
          type: 'video',
          title: '60-Second Smart Thermostat Installation',
          description: 'Quick time-lapse tutorial showing DIY smart thermostat installation with beginner-friendly tips',
          caption: '🏠✨ Transform your home into a smart home in just 60 seconds! This easy DIY project can save you up to $200 on installation costs. Who\'s ready to upgrade? 💡\n\n#SmartHome #DIY #HomeImprovement #TechTuesday #SaveMoney',
          hashtags: ['#SmartHome', '#DIY', '#HomeImprovement', '#TechTuesday', '#SaveMoney', '#LowesProjects'],
          platform: ['Instagram', 'TikTok', 'YouTube Shorts'],
          trendBased: true,
          engagementPrediction: '+340% above average',
          difficulty: 'Easy'
        },
        {
          id: '2',
          type: 'carousel',
          title: 'Before & After: Kitchen Cabinet Transformation',
          description: '5-slide carousel showing step-by-step cabinet painting process with dramatic before/after reveal',
          caption: '🎨 Kitchen glow-up alert! 🔥 Swipe to see how we transformed these dated cabinets with just paint and new hardware. Total cost: under $200! 💰\n\nSlide 1: Before (yikes!)\nSlide 2: Prep work\nSlide 3: Primer application\nSlide 4: Paint magic\nSlide 5: STUNNING after! ✨',
          hashtags: ['#KitchenReno', '#CabinetPainting', '#DIYKitchen', '#HomeReno', '#BudgetFriendly'],
          platform: ['Instagram', 'Facebook'],
          trendBased: true,
          engagementPrediction: '+180% saves predicted',
          difficulty: 'Medium'
        },
        {
          id: '3',
          type: 'post',
          title: 'Sustainable Building Materials Guide',
          description: 'Educational post about eco-friendly materials trending in home improvement',
          caption: '🌱 Going green with your next project? Here are the top sustainable materials that are both eco-friendly AND budget-friendly! 🌍\n\n✅ Bamboo flooring - renewable & durable\n✅ Recycled steel - strong & sustainable\n✅ Cork insulation - natural & efficient\n✅ Reclaimed wood - unique & eco-conscious\n\nWhich one are you trying first? 👇',
          hashtags: ['#SustainableHome', '#EcoFriendly', '#GreenBuilding', '#SustainableLiving'],
          platform: ['Instagram', 'Facebook', 'LinkedIn'],
          trendBased: true,
          engagementPrediction: '+220% engagement',
          difficulty: 'Easy'
        },
        {
          id: '4',
          type: 'video',
          title: 'Outdoor Kitchen Setup in 90 Seconds',
          description: 'Fast-paced tutorial for creating an outdoor cooking space perfect for spring entertaining',
          caption: '🔥 Spring is coming and outdoor entertaining season is HERE! 🌸 Watch us create the perfect outdoor kitchen setup in under 90 seconds. Your backyard will never be the same! 🏡\n\n🍔 Grill station ✅\n🍽️ Prep area ✅\n🧊 Beverage station ✅\n💡 Lighting ✅\n\nTag someone who needs this setup! 👇',
          hashtags: ['#OutdoorKitchen', '#BackyardGoals', '#SpringProjects', '#OutdoorLiving'],
          platform: ['Instagram', 'TikTok', 'YouTube'],
          trendBased: true,
          engagementPrediction: '+280% shares expected',
          difficulty: 'Medium'
        }
      ]
      
      setGeneratedContent(mockContent)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'carousel': return <Image className="w-4 h-4" />
      case 'story': return <Hash className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI Content Generator</h1>
          <p className="text-gray-600 mt-1">Generate engaging social media content based on trending topics and AI insights</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              ✨ Powered by GPT-4
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              📊 Trend-Based Generation
            </span>
          </div>
        </div>
      </div>

      {/* Content Generation Controls */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Content Generation Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trending Topics */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">📈 Select Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {availableTrends.map((trend) => (
                <button
                  key={trend}
                  onClick={() => {
                    setSelectedTrends(prev => 
                      prev.includes(trend) 
                        ? prev.filter(t => t !== trend)
                        : [...prev, trend]
                    )
                  }}
                  className={`category-pill ${
                    selectedTrends.includes(trend) ? 'category-pill-active' : 'category-pill-inactive'
                  }`}
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">📱 Content Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      contentType === type.id 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">💭 Custom Prompt (Optional)</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., 'Create content for spring outdoor projects targeting DIY beginners...'"
            className="input-field h-20 resize-none"
          />
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={generateAIContent}
            disabled={isGenerating}
            className="btn-primary flex items-center space-x-2 px-8 py-3"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI is generating content...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>✨ Generate AI Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">🎨 AI-Generated Content Ideas</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              {generatedContent.length} ideas generated
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedContent.map((content) => (
              <div key={content.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(content.type)}
                    <h3 className="font-bold text-gray-900">{content.title}</h3>
                    {content.trendBased && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        🔥 Trending
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(content.difficulty)}`}>
                    {content.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{content.description}</p>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">📝 Generated Caption:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{content.caption}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Platforms: </span>
                    <span className="text-sm text-gray-600">{content.platform.join(', ')}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Predicted Performance: </span>
                    <span className="text-sm text-green-600 font-medium">{content.engagementPrediction}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {content.hashtags.map((hashtag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => copyToClipboard(content.caption)}
                    className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Caption</span>
                  </button>
                  <button className="btn-secondary px-3">
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentGenerator
