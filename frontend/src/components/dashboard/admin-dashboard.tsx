import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  UsersIcon, 
  FolderIcon,
  DollarSignIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  ActivityIcon
} from "lucide-react";

export function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/admin/recent-activity'],
  });

  const { data: alerts } = useQuery({
    queryKey: ['/api/admin/alerts'],
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="opacity-90">Monitor and manage the ProConnect platform</p>
          </div>
          <div className="flex items-center space-x-6 text-center">
            <div>
              <div className="text-2xl font-bold">{stats?.totalUsers || '0'}</div>
              <div className="text-sm opacity-90">Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.activeProjects || '0'}</div>
              <div className="text-sm opacity-90">Active Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/20">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-green-600">+12% from last month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{stats?.activeProjects || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/20">
                <FolderIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-green-600">+8% from last month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${stats?.totalRevenue || '0'}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSignIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-green-600">+15% from last month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900/20">
                <TrendingUpIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-green-600">+2% from last month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Important notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!alerts || alerts.length === 0 ? (
                <div className="text-center py-8">
                  <ShieldCheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All systems operational</h3>
                  <p className="text-muted-foreground">No alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start" data-testid="manage-users">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full justify-start" data-testid="moderate-projects">
                  <FolderIcon className="mr-2 h-4 w-4" />
                  Moderate Projects
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start" data-testid="view-analytics">
                  <BarChart3Icon className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full justify-start" data-testid="system-settings">
                  <ShieldCheckIcon className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Server Load</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Database Usage</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-muted-foreground">All services operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Recent Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!recentActivity || recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity to display
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border-l-4 border-l-primary/20 bg-muted/30">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <ActivityIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
