import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import {
  HomeIcon,
  SearchIcon,
  FolderIcon,
  MessageSquareIcon,
  UserIcon,
  PlusIcon,
  UsersIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Updated nav items
  const clientNavItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/dashboard" },
    { icon: FolderIcon, label: "All Projects", href: "/projects/all" }, // New link for all projects posted by client
    { icon: SearchIcon, label: "Find Freelancers", href: "/freelancers/browse" },
    { icon: PlusIcon, label: "Post Project", href: "/projects/create" },
    { icon: MessageSquareIcon, label: "Messages", href: "/messages" }
  ];

  const freelancerNavItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/dashboard" },
    { icon: SearchIcon, label: "Find Work", href: "/projects/all" },
    { icon: FolderIcon, label: "My Proposals", href: "/dashboard?tab=proposals" },
    { icon: FolderIcon, label: "Active Projects", href: "/dashboard?tab=active" },
    { icon: MessageSquareIcon, label: "Messages", href: "/messages" }
  ];

  const adminNavItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/dashboard" },
    { icon: UsersIcon, label: "Users", href: "/admin/users" },
    { icon: FolderIcon, label: "Projects", href: "/admin/projects" }
  ];

  let navItems = freelancerNavItems;
  if (user.role === "client") navItems = clientNavItems;
  if (user.role === "admin") navItems = adminNavItems;

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border overflow-y-auto",
        "h-[calc(100vh-4rem)]", 
        className
      )}
    >
      {/* User Profile */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {user.role}
              </Badge>
              {user.role === "freelancer" && (
                <div className="flex items-center space-x-1">
                  <div className="text-xs text-sidebar-foreground">4.9</div>
                  <div className="text-xs text-yellow-500">★</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
                  location === item.href
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                )}
                data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Separator className="my-6" />

        <ul className="space-y-1">
          <li>
            <Link
              href="/profile/edit"
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sidebar-foreground font-medium transition-colors",
                location === "/profile/edit"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
              )}
              data-testid="sidebar-profile"
            >
              <UserIcon className="mr-3 h-4 w-4" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Quick Stats */}
      {(user.role === "freelancer" || user.role === "client") && (
        <div className="p-4 border-t border-sidebar-border mt-auto">
          {user.role === "freelancer" && (
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-sidebar-primary">
                  ${user.totalEarnings || "0"}
                </div>
                <div className="text-xs text-sidebar-foreground">Total Earned</div>
              </div>
              <div>
                <div className="text-lg font-bold text-sidebar-primary">
                  {user.reviewCount || 0}
                </div>
                <div className="text-xs text-sidebar-foreground">Reviews</div>
              </div>
            </div>
          )}
          {user.role === "client" && (
            <div className="text-center">
              <div className="text-lg font-bold text-sidebar-primary">
                ${user.totalSpent || "0"}
              </div>
              <div className="text-xs text-sidebar-foreground">Total Spent</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}