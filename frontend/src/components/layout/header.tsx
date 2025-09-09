import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { 
  HandshakeIcon, 
  MoonIcon, 
  SunIcon, 
  MenuIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
  });

  const unreadCount = notifications?.notifications?.filter((n: any) => !n.isRead).length || 0;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <HandshakeIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ProConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link href="/projects/all">
                  <Button 
                    variant="ghost" 
                    className={location === "/projects/all" ? "bg-accent" : ""}
                    data-testid="nav-find-work"
                  >
                    Find Work
                  </Button>
                </Link>
                <Link href="/freelancers/browse">
                  <Button 
                    variant="ghost"
                    className={location === "/freelancers/browse" ? "bg-accent" : ""}
                    data-testid="nav-find-talent"
                  >
                    Find Talent
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button 
                    variant="ghost"
                    className={location === "/messages" ? "bg-accent" : ""}
                    data-testid="nav-messages"
                  >
                    Messages
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="#browse-tasks">
                  <Button variant="ghost" data-testid="nav-find-work">Find Work</Button>
                </Link>
                <Link href="#find-talent">
                  <Button variant="ghost" data-testid="nav-find-talent">Find Talent</Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="ghost" data-testid="nav-how-it-works">How It Works</Button>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-background border border-border text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative bg-background border border-border text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                      data-testid="notifications-trigger"
                    >
                      <BellIcon className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                          data-testid="notification-badge"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="backdrop-blur-sm bg-background/90 border border-border shadow-xl"
                  >
                    <div className="p-2 font-semibold">Notifications</div>
                    <DropdownMenuSeparator />
                    {notifications?.notifications?.slice(0, 5).map((notification: any) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">{notification.message}</div>
                      </DropdownMenuItem>
                    ))}
                    {notifications?.notifications?.length === 0 && (
                      <DropdownMenuItem>No notifications</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu-trigger">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="backdrop-blur-sm bg-background/90 border border-border shadow-xl"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className="text-foreground hover:text-[var(--primary)] focus:text-[var(--primary)] cursor-pointer"
                    >
                      <Link href="/dashboard" data-testid="menu-dashboard">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="text-foreground hover:text-[var(--primary)] focus:text-[var(--primary)] cursor-pointer"
                    >
                      <Link href="/profile/edit" data-testid="menu-profile">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      data-testid="menu-logout"
                      className="text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-[var(--background)] focus:text-[var(--destructive)] cursor-pointer transition"
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" data-testid="button-sign-in">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="button-get-started">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-trigger"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/projects/all">
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-find-work">
                    Find Work
                  </Button>
                </Link>
                <Link href="/freelancers/browse">
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-find-talent">
                    Find Talent
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-messages">
                    Messages
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-find-work">
                  Find Work
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-find-talent">
                  Find Talent
                </Button>
                <Button variant="ghost" className="w-full justify-start" data-testid="mobile-nav-how-it-works">
                  How It Works
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
