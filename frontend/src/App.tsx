import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Target,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Brain,
  Lightbulb,
  Zap
} from 'lucide-react'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [competitorResults, setCompetitorResults] = useState<any>(null)
  const [lowesResults, setLowesResults] = useState<any>(null)
  const [strategyResults, setStrategyResults] = useState<any>(null)
  const [campaignResults, setCampaignResults] = useState<any>(null)
  const [loading, setLoading] = useState<any>({})
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  // No tabs - navigation happens from dashboard

  const startAnalysis = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }))
    setCurrentStep(0)

    // Set processing steps based on analysis type
    const steps = getProcessingSteps(type)
    setProcessingSteps(steps)

    try {
      const response = await fetch(`http://localhost:8002/api/analyze/${type}`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.task_id) {
        // Start step animation
        animateProcessingSteps(steps.length)
        // Poll for results
        pollForResults(data.task_id, type)
      }
    } catch (error) {
      console.error(`Error starting ${type} analysis:`, error)
      setLoading(prev => ({ ...prev, [type]: false }))
      setProcessingSteps([])
    }
  }

  const getProcessingSteps = (type: string) => {
    const stepsByType = {
      competitors: [
        'Initializing web search crawlers...',
        'Searching Home Depot Instagram posts...',
        'Analyzing Menards Facebook content...',
        'Crawling Wayfair social media...',
        'Extracting Ace Hardware engagement data...',
        'Processing competitor posting patterns...',
        'Analyzing engagement metrics...',
        'Identifying content gaps...',
        'Generating competitive insights...'
      ],
      lowes: [
        'Searching Lowe\'s Instagram posts...',
        'Analyzing Lowe\'s Facebook content...',
        'Crawling Lowe\'s Twitter/X posts...',
        'Extracting engagement metrics...',
        'Identifying high-performing content...',
        'Analyzing low-performing posts...',
        'Processing posting patterns...',
        'Generating performance insights...'
      ],
      strategy: [
        'Analyzing current market trends...',
        'Processing competitor data...',
        'Evaluating Lowe\'s performance patterns...',
        'Identifying content opportunities...',
        'Generating strategic recommendations...',
        'Creating content ideas...',
        'Optimizing posting strategies...'
      ],
      campaigns: [
        'Connecting to Google Ads API...',
        'Fetching Google Ads campaign data...',
        'Connecting to Meta Ads API...',
        'Retrieving Facebook/Instagram ad performance...',
        'Analyzing campaign ROI and ROAS...',
        'Identifying high-performing ad content...',
        'Processing cross-platform performance...',
        'Generating optimization recommendations...'
      ]
    }
    return stepsByType[type as keyof typeof stepsByType] || []
  }

  const animateProcessingSteps = async (totalSteps: number) => {
    for (let i = 0; i < totalSteps; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    }
  }

  const pollForResults = async (taskId: string, type: string) => {
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`http://localhost:8002/api/results/${taskId}`)
        const data = await response.json()

        if (data.status === 'completed') {
          if (type === 'competitors') {
            setCompetitorResults(data.results)
          } else if (type === 'lowes') {
            setLowesResults(data.results)
          } else if (type === 'strategy') {
            setStrategyResults(data.results)
          } else if (type === 'campaigns') {
            setCampaignResults(data.results)
          }
          setLoading(prev => ({ ...prev, [type]: false }))
          setProcessingSteps([])
          setCurrentStep(0)
        } else if (data.status === 'running' && attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 5000) // Poll every 5 seconds
        } else {
          setLoading(prev => ({ ...prev, [type]: false }))
          setProcessingSteps([])
          setCurrentStep(0)
        }
      } catch (error) {
        console.error('Polling error:', error)
        setLoading(prev => ({ ...prev, [type]: false }))
        setProcessingSteps([])
        setCurrentStep(0)
      }
    }

    poll()
  }

  const Dashboard = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🤖 Lowe's AI Social Media Analytics</h1>
        <p className="text-xl text-gray-600 mb-8">AI-powered competitor analysis and content strategy using real-time web search</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="card text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          onClick={() => setCurrentPage('competitors')}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Competitor Analysis</h3>
          <p className="text-gray-600 text-xs mb-4">AI analyzes competitor social media using web search</p>
          <div className="text-blue-600 font-medium text-sm">Analyze →</div>
        </div>

        <div
          className="card text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          onClick={() => setCurrentPage('lowes')}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Lowe's Performance</h3>
          <p className="text-gray-600 text-xs mb-4">AI analyzes Lowe's social media performance</p>
          <div className="text-green-600 font-medium text-sm">Analyze →</div>
        </div>

        <div
          className="card text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          onClick={() => setCurrentPage('campaigns')}
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ad Campaign Analysis</h3>
          <p className="text-gray-600 text-xs mb-4">AI analyzes Google & Meta ad performance</p>
          <div className="text-orange-600 font-medium text-sm">Analyze →</div>
        </div>

        <div
          className="card text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          onClick={() => setCurrentPage('strategy')}
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Strategy & Content</h3>
          <p className="text-gray-600 text-xs mb-4">Generate strategic recommendations</p>
          <div className="text-purple-600 font-medium text-sm">Generate →</div>
        </div>
      </div>

      <div className="card text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Web Search Analysis</h3>
            <p className="text-gray-600 text-sm">AI agents use real-time web search to find and analyze social media posts from competitors and Lowe's across platforms</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Processing</h3>
            <p className="text-gray-600 text-sm">Advanced AI models process engagement data, identify patterns, and extract insights from thousands of posts and interactions</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Strategic Insights</h3>
            <p className="text-gray-600 text-sm">Generate actionable recommendations, content ideas, and strategic advice based on real data and current market trends</p>
          </div>
        </div>
      </div>
    </div>
  )

  const CompetitorAnalysis = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">🎯 Competitor Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis of competitor social media using real-time web search</p>
        </div>
        <button
          onClick={() => startAnalysis('competitors')}
          disabled={loading.competitors}
          className="btn-primary flex items-center space-x-2"
        >
          {loading.competitors ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>🚀 Run Analysis</span>
            </>
          )}
        </button>
      </div>

      {loading.competitors && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900">AI is analyzing competitors...</h2>
          </div>
          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : index === currentStep ? (
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
                <span className={`${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
                {index === currentStep && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              🔍 <strong>Sources being analyzed:</strong> Instagram posts, Facebook content, Twitter/X posts, engagement metrics, posting patterns, content themes
            </p>
          </div>
        </div>
      )}

      {competitorResults && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">🤖 AI Analysis Results</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Analysis Complete
            </span>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <pre className="whitespace-pre-wrap text-sm text-blue-800 leading-relaxed">
              {competitorResults.result}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              📊 <strong>Analysis completed at:</strong> {new Date(competitorResults.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {!competitorResults && !loading.competitors && (
        <div className="card text-center py-16">
          <Target className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Analyze Competitors</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Click "Run Analysis" to start AI-powered competitor analysis using real-time web search across social media platforms
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                🏠
              </div>
              <span className="text-sm text-gray-600">Home Depot</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                🏪
              </div>
              <span className="text-sm text-gray-600">Menards</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                🛋️
              </div>
              <span className="text-sm text-gray-600">Wayfair</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                🔧
              </div>
              <span className="text-sm text-gray-600">Ace Hardware</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const LowesPerformance = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">📊 Lowe's Performance Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis of Lowe's social media performance using real-time web search</p>
        </div>
        <button
          onClick={() => startAnalysis('lowes')}
          disabled={loading.lowes}
          className="btn-primary flex items-center space-x-2"
        >
          {loading.lowes ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4" />
              <span>🔍 Analyze Performance</span>
            </>
          )}
        </button>
      </div>

      {loading.lowes && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <RefreshCw className="w-6 h-6 text-green-500 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900">AI is analyzing Lowe's performance...</h2>
          </div>
          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : index === currentStep ? (
                  <RefreshCw className="w-5 h-5 text-green-500 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
                <span className={`${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
                {index === currentStep && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm">
              🔍 <strong>Analyzing Lowe's content:</strong> Instagram posts, Facebook content, Twitter/X posts, engagement metrics, high/low performing content
            </p>
          </div>
        </div>
      )}

      {lowesResults && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">📈 Lowe's Performance Analysis Results</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Analysis Complete
            </span>
          </div>
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
            <pre className="whitespace-pre-wrap text-sm text-green-800 leading-relaxed">
              {lowesResults.result}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              📊 <strong>Analysis completed at:</strong> {new Date(lowesResults.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {!lowesResults && !loading.lowes && (
        <div className="card text-center py-16">
          <BarChart3 className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Analyze Lowe's Performance</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Click "Analyze Performance" to start AI-powered analysis of Lowe's social media performance across platforms
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                📱
              </div>
              <span className="text-sm text-gray-600">Instagram Analysis</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                📘
              </div>
              <span className="text-sm text-gray-600">Facebook Analysis</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                🐦
              </div>
              <span className="text-sm text-gray-600">Twitter/X Analysis</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const CampaignAnalysis = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">📊 Ad Campaign Analysis</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis of Google Ads and Meta Ads campaign performance using mock APIs</p>
        </div>
        <button
          onClick={() => startAnalysis('campaigns')}
          disabled={loading.campaigns}
          className="btn-primary flex items-center space-x-2"
        >
          {loading.campaigns ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>🚀 Analyze Campaigns</span>
            </>
          )}
        </button>
      </div>

      {loading.campaigns && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900">AI is analyzing ad campaigns...</h2>
          </div>
          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : index === currentStep ? (
                  <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
                <span className={`${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
                {index === currentStep && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-orange-800 text-sm">
              🔗 <strong>Connecting to APIs:</strong> Google Ads API, Meta Ads API, campaign performance data, ROI analysis
            </p>
          </div>
        </div>
      )}

      {campaignResults && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">📈 Ad Campaign Analysis Results</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
              Analysis Complete
            </span>
          </div>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
            <pre className="whitespace-pre-wrap text-sm text-orange-800 leading-relaxed">
              {campaignResults.result}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              📊 <strong>Analysis completed at:</strong> {new Date(campaignResults.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {!campaignResults && !loading.campaigns && (
        <div className="card text-center py-16">
          <Zap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Analyze Ad Campaigns</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Click "Analyze Campaigns" to start AI-powered analysis of Google Ads and Meta Ads campaign performance
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Google Ads Analysis</h4>
              <p className="text-sm text-gray-600">Campaign performance, CTR, CPC, conversion rates, and ROI analysis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Meta Ads Analysis</h4>
              <p className="text-sm text-gray-600">Facebook/Instagram ad performance, reach, engagement, and conversion tracking</p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">🤖 AI Campaign Optimization Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>• Cross-platform performance comparison</div>
              <div>• ROAS optimization recommendations</div>
              <div>• Budget reallocation suggestions</div>
              <div>• Content-to-ad performance mapping</div>
              <div>• Seasonal campaign insights</div>
              <div>• Automated campaign recommendations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const TrendsAndContent = () => {
    const [customPrompt, setCustomPrompt] = useState('')
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [contentResults, setContentResults] = useState<any>(null)
    const [loadingContent, setLoadingContent] = useState(false)

    const contentOptions = [
      'Instagram Reel Ideas',
      'Facebook Post Concepts',
      'Twitter Thread Topics',
      'YouTube Video Ideas',
      'Blog Post Topics',
      'Email Campaign Ideas',
      'Seasonal Content',
      'Product Launch Content',
      'DIY Tutorial Ideas',
      'Before/After Showcases'
    ]

    const generateCustomContent = async () => {
      setLoadingContent(true)

      // Simulate AI content generation
      setTimeout(() => {
        const mockContent = {
          result: `🤖 AI-GENERATED CONTENT STRATEGY

Based on current trends, competitor analysis, and Lowe's performance data:

📱 CUSTOM CONTENT RECOMMENDATIONS:
${customPrompt ? `For your request: "${customPrompt}"` : 'Based on selected options:'}

${selectedOptions.length > 0 ? selectedOptions.map(option => `• ${option}`).join('\n') : ''}

🎬 SPECIFIC CONTENT IDEAS:

1. "Smart Home Sunday" Series
   - Weekly Instagram Reels showing 60-second smart device installations
   - Focus on beginner-friendly projects
   - Expected engagement: +340% vs current average

2. "Tool Tuesday Transformation"
   - Before/after posts using specific tools
   - Educational carousel posts explaining tool usage
   - Target: DIY enthusiasts and beginners

3. "Seasonal Project Spotlight"
   - Trending outdoor projects for current season
   - Time-lapse videos of deck/patio transformations
   - User-generated content campaigns

📊 PERFORMANCE PREDICTIONS:
• Video content: +280% engagement increase
• Educational posts: +250% saves
• User-generated campaigns: +320% engagement
• Seasonal content: +200% shares

🏷️ OPTIMIZED HASHTAG STRATEGY:
Primary: #LowesProjects #DIYHome #SmartHomeDIY
Trending: #HomeTransformation #WeekendProject #DIYBeginner

⏰ OPTIMAL POSTING SCHEDULE:
• Instagram: Tuesday 2-4 PM EST
• Facebook: Wednesday 1-3 PM EST
• Twitter: Thursday 11 AM-1 PM EST`,
          timestamp: new Date().toISOString()
        }
        setContentResults(mockContent)
        setLoadingContent(false)
      }, 3000)
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center space-x-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">🔥 AI Strategy & Content Generation</h1>
            <p className="text-gray-600 mt-1">Generate strategic recommendations and content ideas based on current trends, competitor analysis, and Lowe's performance data</p>
          </div>
          <button
            onClick={() => startAnalysis('strategy')}
            disabled={loading.strategy}
            className="btn-primary flex items-center space-x-2"
          >
            {loading.strategy ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" />
                <span>✨ Generate Strategy</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Content Generator */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🎨 Custom Content Generator</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                📝 Custom Content Request (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., 'I need Instagram Reel ideas for spring outdoor projects targeting DIY beginners with a focus on smart home integration...'"
                className="input-field h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                🎯 Content Type Options (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {contentOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedOptions(prev =>
                        prev.includes(option)
                          ? prev.filter(o => o !== option)
                          : [...prev, option]
                      )
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedOptions.includes(option)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateCustomContent}
              disabled={loadingContent || (!customPrompt.trim() && selectedOptions.length === 0)}
              className="btn-primary flex items-center space-x-2"
            >
              {loadingContent ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Content...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>🚀 Generate Custom Content</span>
                </>
              )}
            </button>
          </div>

          {loadingContent && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <RefreshCw className="w-5 h-5 text-purple-500 animate-spin" />
                <span className="font-medium text-purple-900">AI is generating custom content...</span>
              </div>
              <div className="space-y-2 text-sm text-purple-800">
                <div>🔍 Analyzing current market trends...</div>
                <div>📊 Processing competitor strategies...</div>
                <div>📈 Evaluating Lowe's performance data...</div>
                <div>✨ Generating personalized content ideas...</div>
              </div>
            </div>
          )}

          {contentResults && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">🎯 Custom Content Results</h3>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <pre className="whitespace-pre-wrap text-sm text-purple-800 leading-relaxed">
                  {contentResults.result}
                </pre>
              </div>
            </div>
          )}
        </div>

        {loading.strategy && (
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
              <h2 className="text-xl font-bold text-gray-900">AI is generating comprehensive strategy...</h2>
            </div>
            <div className="space-y-3">
              {processingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : index === currentStep ? (
                    <RefreshCw className="w-5 h-5 text-purple-500 animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {step}
                  </span>
                  {index === currentStep && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-purple-800 text-sm">
                🧠 <strong>AI is analyzing:</strong> Current trends, competitor strategies, Lowe's performance data, market opportunities, content patterns
              </p>
            </div>
          </div>
        )}

        {strategyResults && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">🧠 AI Strategy & Content Recommendations</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                Strategy Complete
              </span>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
              <pre className="whitespace-pre-wrap text-sm text-purple-800 leading-relaxed">
                {strategyResults.result}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">
                📊 <strong>Strategy generated at:</strong> {new Date(strategyResults.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {!strategyResults && !loading.strategy && (
          <div className="card text-center py-16">
            <Lightbulb className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Generate AI Strategy</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Click "Generate Strategy" to get AI-powered content recommendations based on current trends, competitor analysis, and Lowe's performance data
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  📊
                </div>
                <span className="text-sm text-gray-600">Trend Analysis</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  🎯
                </div>
                <span className="text-sm text-gray-600">Strategy Generation</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  ✨
                </div>
                <span className="text-sm text-gray-600">Content Ideas</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="hero-gradient text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lowe's AI Analytics</h1>
              <p className="text-white opacity-80 text-sm">AI-Powered Social Media Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'competitors' && <CompetitorAnalysis />}
        {currentPage === 'lowes' && <LowesPerformance />}
        {currentPage === 'campaigns' && <CampaignAnalysis />}
        {currentPage === 'strategy' && <TrendsAndContent />}
      </main>
    </div>
  )
}

export default App
