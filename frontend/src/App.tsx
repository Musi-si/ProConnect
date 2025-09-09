import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/auth-context";
import { ThemeProvider } from "./contexts/theme-context";
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import VerifyEmail from "@/pages/auth/verify-email";
import Dashboard from "@/pages/dashboard";
import BrowseProjects from "@/pages/projects/all";
import CreateProject from "@/pages/projects/create";
import ProjectDetails from "@/pages/projects/details";
import BrowseFreelancers from "@/pages/freelancers/browse";
import EditProfile from "@/pages/profile/edit";
import Messages from "@/pages/messages";
import NotFound from "@/pages/not-found";
import { ProjectProvider } from "./contexts/project-context";
import { UserProvider } from "./contexts/user-context"; // make sure path is correct

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/projects/all" component={BrowseProjects} />
      <Route path="/projects/create" component={CreateProject} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/freelancers/browse" component={BrowseFreelancers} />
      <Route path="/profile/edit" component={EditProfile} />
      <Route path="/messages" component={Messages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider> {/* Add this */}
              <ProjectProvider>
                <Toaster />
                <Router />
              </ProjectProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
