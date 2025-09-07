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
          </div>
        </main>
      </div>
    </div>
  );
}
