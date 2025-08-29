import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  FileText, 
  Eye, 
  Calendar, 
  TrendingUp,
  Users,
  Activity,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import { storage } from "@/lib/storage";
import type { AnalyticsData, ActivityEvent } from "@/lib/types";

const AdminOverview = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    document.title = "Overview - Admin Dashboard";
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const analyticsData = storage.getAnalytics();
    const activity = storage.getActivity().slice(0, 10);
    
    setAnalytics(analyticsData);
    setRecentActivity(activity);
  };

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

  if (!analytics) {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to your admin dashboard. Here's a quick overview of your legal blog.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button asChild>
              <Link to="/admin/articles/new">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/drafts">
                <FileText className="h-4 w-4 mr-2" />
                View Drafts
              </Link>
            </Button>
          </div>
        </div>

        {/* Website Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              About Your Legal Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Achut's Legal Notebook</strong> is a comprehensive legal blog providing in-depth analysis, 
              case studies, and commentary on current legal developments affecting Kenya and East Africa. 
              The platform serves legal practitioners, students, and the general public with accessible 
              legal insights and practical guidance across various areas of law.
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalArticles}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.publishedArticles} published, {analytics.draftArticles} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views (30d)</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ~{avgDailyViews} per day average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.weeklyViews[analytics.weeklyViews.length - 1]?.views || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Views this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Article</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.topArticles[0]?.views || 0}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {analytics.topArticles[0]?.title || 'No data'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest actions and updates from the admin system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
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

              {recentActivity.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/admin/analytics">
                      View All Activity
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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
                  analytics.topArticles.slice(0, 5).map((article, index) => (
                    <div key={article.slug} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {article.views} views
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/articles/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No article data available
                  </p>
                )}
              </div>

              {analytics.topArticles.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/admin/analytics">
                      View Analytics
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for managing your blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="h-auto p-4 justify-start">
                <Link to="/admin/articles/new">
                  <div className="text-left">
                    <div className="flex items-center mb-1">
                      <Plus className="h-4 w-4 mr-2" />
                      New Article
                    </div>
                    <p className="text-xs opacity-80">
                      Create a new article or draft
                    </p>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link to="/admin/drafts">
                  <div className="text-left">
                    <div className="flex items-center mb-1">
                      <FileText className="h-4 w-4 mr-2" />
                      View Drafts
                    </div>
                    <p className="text-xs opacity-80">
                      Manage unpublished articles
                    </p>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link to="/admin/notifications">
                  <div className="text-left">
                    <div className="flex items-center mb-1">
                      <Activity className="h-4 w-4 mr-2" />
                      Notifications
                    </div>
                    <p className="text-xs opacity-80">
                      View system notifications
                    </p>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4 justify-start">
                <Link to="/admin/settings">
                  <div className="text-left">
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      Settings
                    </div>
                    <p className="text-xs opacity-80">
                      Account and site settings
                    </p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
