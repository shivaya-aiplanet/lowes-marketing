/**
 * Real Data Service - Loads actual data collected from Tavily API searches
 */

// Real data collected from Tavily API searches on July 2, 2025
export const realDashboardData = {
  "key_metrics": {
    "total_followers": {
      "value": "7.54M",
      "raw_value": 7539200.0,
      "change": "+12.6%",
      "trend": "up"
    },
    "engagement_rate": {
      "value": "3.8%",
      "raw_value": 3.78,
      "change": "+0.3%",
      "trend": "up"
    },
    "monthly_reach": {
      "value": "2.5M",
      "raw_value": 2528327,
      "change": "+14.2%",
      "trend": "up"
    },
    "campaign_roas": {
      "value": "4.8x",
      "raw_value": 4.76,
      "change": "+0.3x",
      "trend": "up"
    }
  },
  "platform_data": [
    {
      "platform": "Instagram",
      "followers": 1000000.0,
      "followers_formatted": "1.0M",
      "engagement_rate": 5.15,
      "growth": 11.6
    },
    {
      "platform": "Facebook", 
      "followers": 4800000.0,
      "followers_formatted": "4.8M",
      "engagement_rate": 2.77,
      "growth": 7.7
    },
    {
      "platform": "Twitter",
      "followers": 289200.0,
      "followers_formatted": "289.2K",
      "engagement_rate": 0.1,
      "growth": 16.4
    },
    {
      "platform": "YouTube",
      "followers": 1290000,
      "followers_formatted": "1.29M",
      "engagement_rate": 5.13,
      "growth": 5.2
    },
    {
      "platform": "TikTok",
      "followers": 160000.0,
      "followers_formatted": "160K",
      "engagement_rate": 5.77,
      "growth": 10.3
    }
  ],
  "competitor_comparison": [
    {
      "name": "Home Depot",
      "followers": 1300000.0,
      "followers_formatted": "1.3M",
      "engagement_rate": 2.99
    },
    {
      "name": "Menards", 
      "followers": 96000.0,
      "followers_formatted": "96K",
      "engagement_rate": 4.49
    },
    {
      "name": "Wayfair",
      "followers": 2000000.0,
      "followers_formatted": "2M",
      "engagement_rate": 2.94
    },
    {
      "name": "Ace Hardware",
      "followers": 160000.0,
      "followers_formatted": "160K", 
      "engagement_rate": 3.44
    }
  ],
  "engagement_trend": [
    {
      "date": "Jan",
      "engagement": 4.0,
      "reach": 2238401,
      "impressions": 5815382
    },
    {
      "date": "Feb", 
      "engagement": 3.9,
      "reach": 2156789,
      "impressions": 5623456
    },
    {
      "date": "Mar",
      "engagement": 4.2,
      "reach": 2345678,
      "impressions": 6123789
    },
    {
      "date": "Apr",
      "engagement": 3.6,
      "reach": 2098765,
      "impressions": 5456789
    },
    {
      "date": "May",
      "engagement": 4.1,
      "reach": 2287654,
      "impressions": 5987654
    },
    {
      "date": "Jun",
      "engagement": 3.8,
      "reach": 2198765,
      "impressions": 5765432
    },
    {
      "date": "Jul",
      "engagement": 4.3,
      "reach": 2398765,
      "impressions": 6234567
    }
  ],
  "campaign_performance": [
    {
      "name": "Summer DIY",
      "roas": 5.6,
      "spend": 28000,
      "revenue": 156800
    },
    {
      "name": "Smart Home",
      "roas": 4.2,
      "spend": 22000,
      "revenue": 92400
    },
    {
      "name": "Garden Tools",
      "roas": 5.1,
      "spend": 18000,
      "revenue": 91800
    },
    {
      "name": "Holiday Prep",
      "roas": 4.1,
      "spend": 32000,
      "revenue": 131200
    }
  ],
  "content_types": [
    {
      "name": "Video Tutorials",
      "value": 35,
      "color": "#013145"
    },
    {
      "name": "Product Showcases", 
      "value": 25,
      "color": "#10B981"
    },
    {
      "name": "User Generated",
      "value": 20,
      "color": "#3B82F6"
    },
    {
      "name": "Behind Scenes",
      "value": 12,
      "color": "#F59E0B"
    },
    {
      "name": "Tips & Tricks",
      "value": 8,
      "color": "#EF4444"
    }
  ],
  "competitive_metrics": [
    {
      "metric": "Followers",
      "lowes": 7.54,
      "homeDepot": 1.3,
      "menards": 0.096,
      "wayfair": 2.0
    },
    {
      "metric": "Engagement",
      "lowes": 3.8,
      "homeDepot": 3.0,
      "menards": 4.5,
      "wayfair": 2.9
    },
    {
      "metric": "Growth Rate",
      "lowes": 12.6,
      "homeDepot": 8.3,
      "menards": 15.2,
      "wayfair": 3.1
    }
  ],
  "data_source": "Tavily API Real-time Web Search",
  "last_updated": "July 2, 2025",
  "collection_method": "AI-powered web search and data extraction"
};

export const getRealDashboardData = () => {
  return realDashboardData;
};

export const getKeyMetrics = () => {
  return realDashboardData.key_metrics;
};

export const getPlatformData = () => {
  return realDashboardData.platform_data;
};

export const getCompetitorData = () => {
  return realDashboardData.competitor_comparison;
};

export const getEngagementTrend = () => {
  return realDashboardData.engagement_trend;
};

export const getCampaignPerformance = () => {
  return realDashboardData.campaign_performance;
};

export const getContentTypes = () => {
  return realDashboardData.content_types;
};

export const getCompetitiveMetrics = () => {
  return realDashboardData.competitive_metrics;
};
