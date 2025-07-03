import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Eye, Heart, MessageCircle, DollarSign, Target, Calendar, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center mt-2">
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
    </div>
  </div>
);

interface AnalyticsDashboardProps {
  onBack?: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data - in real app, this would come from API
  const followerData = [
    { platform: 'Instagram', followers: 1700000, growth: 12.5 },
    { platform: 'Facebook', followers: 4800000, growth: 8.3 },
    { platform: 'Twitter', followers: 290000, growth: -2.1 },
    { platform: 'YouTube', followers: 850000, growth: 15.7 },
    { platform: 'TikTok', followers: 320000, growth: 45.2 },
  ];

  const engagementTrend = [
    { date: 'Jan', engagement: 2.4, reach: 1200000, impressions: 3500000 },
    { date: 'Feb', engagement: 2.8, reach: 1350000, impressions: 3800000 },
    { date: 'Mar', engagement: 3.1, reach: 1500000, impressions: 4200000 },
    { date: 'Apr', engagement: 2.9, reach: 1450000, impressions: 4000000 },
    { date: 'May', engagement: 3.4, reach: 1650000, impressions: 4600000 },
    { date: 'Jun', engagement: 3.8, reach: 1800000, impressions: 5100000 },
    { date: 'Jul', engagement: 4.2, reach: 1950000, impressions: 5500000 },
  ];

  const campaignPerformance = [
    { name: 'Summer DIY', roas: 4.2, spend: 25000, revenue: 105000 },
    { name: 'Smart Home', roas: 3.8, spend: 18000, revenue: 68400 },
    { name: 'Garden Tools', roas: 5.1, spend: 12000, revenue: 61200 },
    { name: 'Holiday Prep', roas: 3.2, spend: 30000, revenue: 96000 },
  ];

  const contentTypes = [
    { name: 'Video Tutorials', value: 35, color: '#013145' },
    { name: 'Product Showcases', value: 25, color: '#10B981' },
    { name: 'User Generated', value: 20, color: '#3B82F6' },
    { name: 'Behind Scenes', value: 12, color: '#F59E0B' },
    { name: 'Tips & Tricks', value: 8, color: '#EF4444' },
  ];

  const competitorComparison = [
    { metric: 'Followers', lowes: 1.7, homeDepot: 2.0, menards: 0.038, wayfair: 1.8 },
    { metric: 'Engagement', lowes: 3.8, homeDepot: 2.1, menards: 4.2, wayfair: 0.9 },
    { metric: 'Growth Rate', lowes: 12.5, homeDepot: 8.3, menards: 15.2, wayfair: 3.1 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-teal-600 hover:text-teal-800 mb-4 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900">Marketing Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Followers"
            value="7.86M"
            change="+12.5%"
            trend="up"
            icon={<Users className="h-6 w-6 text-teal-600" />}
            color="#013145"
          />
          <MetricCard
            title="Engagement Rate"
            value="4.2%"
            change="+0.8%"
            trend="up"
            icon={<Heart className="h-6 w-6 text-green-600" />}
            color="#10B981"
          />
          <MetricCard
            title="Monthly Reach"
            value="1.95M"
            change="+15.3%"
            trend="up"
            icon={<Eye className="h-6 w-6 text-blue-600" />}
            color="#3B82F6"
          />
          <MetricCard
            title="Campaign ROAS"
            value="4.1x"
            change="+0.3x"
            trend="up"
            icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
            color="#F59E0B"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Follower Growth by Platform */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Follower Growth by Platform</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={followerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip formatter={(value: any) => [value.toLocaleString(), 'Followers']} />
                <Bar dataKey="followers" fill="#013145" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Content Type Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {contentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign ROAS Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any, name: string) => {
                  if (name === 'roas') return [`${value}x`, 'ROAS'];
                  return [`$${value.toLocaleString()}`, name === 'spend' ? 'Spend' : 'Revenue'];
                }} />
                <Bar dataKey="roas" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach and Impressions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reach vs Impressions Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: any) => [value.toLocaleString()]} />
              <Area type="monotone" dataKey="impressions" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="reach" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Comparison Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowe's</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Depot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menards</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wayfair</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {competitorComparison.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.metric}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-teal-600">{row.lowes}{row.metric === 'Followers' ? 'M' : '%'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.homeDepot}{row.metric === 'Followers' ? 'M' : '%'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.menards}{row.metric === 'Followers' ? 'M' : '%'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.wayfair}{row.metric === 'Followers' ? 'M' : '%'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
