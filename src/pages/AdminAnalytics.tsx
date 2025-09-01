import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Calendar,
  FileText,
  Clock,
  Users,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { storage } from "@/lib/storage";
import type { AnalyticsData, ActivityEvent } from "@/lib/types";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly">("daily");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Analytics - Admin Dashboard";
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setIsLoading(true);
    try {
      const analyticsData = storage.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const totalViews = analytics.dailyViews.reduce((sum, day) => sum + day.views, 0);
  const avgDailyViews = Math.round(totalViews / analytics.dailyViews.length);
  const weeklyTotal = analytics.weeklyViews.reduce((sum, week) => sum + week.views, 0);
  const avgWeeklyViews = Math.round(weeklyTotal / analytics.weeklyViews.length);

  // Prepare chart data
  const chartData = selectedPeriod === "daily" 
    ? analytics.dailyViews.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: item.views
      }))
    : analytics.weeklyViews.map(item => ({
        date: `Week ${item.week.split(' - ')[0].split('-')[2]}`,
        views: item.views
      }));

  // Article category distribution
  const articles = storage.getArticles();
  const categoryData = articles.reduce((acc, article) => {
    const category = article.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count
  }));

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'ARTICLE_CREATED':
      case 'ARTICLE_PUBLISHED':
      case 'ARTICLE_UPDATED':
        return <FileText className="h-4 w-4" />;
      case 'LOGIN':
        return <Users className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityBadgeVariant = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'ARTICLE_PUBLISHED':
        return 'default';
      case 'ARTICLE_CREATED':
        return 'secondary';
      case 'ARTICLE_UPDATED':
        return 'outline';
      case 'LOGIN':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your blog's performance and engagement metrics
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline" onClick={loadAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDailyViews}</div>
              <p className="text-xs text-muted-foreground">
                Views per day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalArticles}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.publishedArticles} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.weeklyViews[analytics.weeklyViews.length - 1]?.views || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Page views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
              <Eye className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.archivedArticles}</div>
              <p className="text-xs text-muted-foreground">
                Hidden articles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="daily">Daily Views</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Views</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Page Views</CardTitle>
                <CardDescription>
                  Page views over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Page Views</CardTitle>
                <CardDescription>
                  Page views over the last 8 weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Top Articles
              </CardTitle>
              <CardDescription>
                Most viewed articles in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topArticles.length > 0 ? (
                  analytics.topArticles.map((article, index) => (
                    <div key={article.slug} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {article.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {article.views} views
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No article data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Article Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Article Categories</CardTitle>
              <CardDescription>
                Distribution of articles by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoryChartData.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {categoryChartData.map((category, index) => (
                      <div key={category.name} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {category.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No category data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events and content updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                          {activity.type.replace('_', ' ').toLowerCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
