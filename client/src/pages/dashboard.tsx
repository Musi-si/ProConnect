import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { FreelancerDashboard } from "@/components/dashboard/freelancer-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'client':
        return <ClientDashboard />;
      case 'freelancer':
        return <FreelancerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <FreelancerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="hidden lg:block w-64 border-r border-border">
          <Sidebar />
        </div>
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {getDashboardComponent()}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="dashboard-card">
                <h2 className="text-xl font-bold mb-2">Welcome, {user.firstName}!</h2>
                <p className="text-muted-foreground mb-4">Here’s a quick overview of your activity.</p>
                <Button className="btn-orange-outline">View Profile</Button>
              </div>
              <div className="dashboard-card">
                <h3 className="font-semibold mb-1">Your Stats</h3>
                <ul className="mb-4">
                  <li>Projects: <span className="font-bold text-[var(--primary)]">12</span></li>
                  <li>Messages: <span className="font-bold text-[var(--primary)]">3</span></li>
                </ul>
                <Button className="btn-orange-outline">See Details</Button>
              </div>
              <div className="dashboard-card">
                <h3 className="font-semibold mb-1">Get Started</h3>
                <p className="mb-4">Find new opportunities or post a project now.</p>
                <Button className="btn-orange-outline mr-2 mb-2">Find Work</Button>
                <Button className="btn-orange-outline">Post Project</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
