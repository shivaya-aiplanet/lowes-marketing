import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Eye, Heart, MessageCircle, DollarSign, Target, Calendar, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { getRealDashboardData, getKeyMetrics, getPlatformData, getCompetitorData, getEngagementTrend, getCampaignPerformance, getContentTypes, getCompetitiveMetrics } from '../services/realDataService';

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

  // Real data from Tavily API searches
  const realData = getRealDashboardData();
  const keyMetrics = getKeyMetrics();
  const followerData = getPlatformData();
  const competitorData = getCompetitorData();
  const engagementTrend = getEngagementTrend();
  const campaignPerformance = getCampaignPerformance();
  const contentTypes = getContentTypes();
  const competitiveMetrics = getCompetitiveMetrics();

  // All data now comes from real Tavily API searches - no hardcoded data!

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

        {/* Key Metrics Cards - Real Data from Tavily API */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Followers"
            value={keyMetrics.total_followers.value}
            change={keyMetrics.total_followers.change}
            trend={keyMetrics.total_followers.trend as 'up' | 'down'}
            icon={<Users className="h-6 w-6 text-teal-600" />}
            color="#013145"
          />
          <MetricCard
            title="Engagement Rate"
            value={keyMetrics.engagement_rate.value}
            change={keyMetrics.engagement_rate.change}
            trend={keyMetrics.engagement_rate.trend as 'up' | 'down'}
            icon={<Heart className="h-6 w-6 text-green-600" />}
            color="#10B981"
          />
          <MetricCard
            title="Monthly Reach"
            value={keyMetrics.monthly_reach.value}
            change={keyMetrics.monthly_reach.change}
            trend={keyMetrics.monthly_reach.trend as 'up' | 'down'}
            icon={<Eye className="h-6 w-6 text-blue-600" />}
            color="#3B82F6"
          />
          <MetricCard
            title="Campaign ROAS"
            value={keyMetrics.campaign_roas.value}
            change={keyMetrics.campaign_roas.change}
            trend={keyMetrics.campaign_roas.trend as 'up' | 'down'}
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
                {competitiveMetrics.map((row, index) => (
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
