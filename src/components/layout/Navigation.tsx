import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, User, Menu, X, Settings, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl gradient-text">SchemaX</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="text-sm font-medium hover:text-primary transition-colors" role="link">
              Home
            </button>
            <button onClick={() => navigate('/services')} className="text-sm font-medium hover:text-primary transition-colors" role="link">
              Services
            </button>
            <button onClick={() => navigate('/search')} className="text-sm font-medium hover:text-primary transition-colors" role="link">
              Find Freelancers
            </button>
            <button onClick={() => navigate('/search')} className="text-sm font-medium hover:text-primary transition-colors" role="link">
              Categories
            </button>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="text-sm font-medium hover:text-primary transition-colors" role="link">
              How it Works
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <NotificationBell />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.display_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.display_name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  {user?.role === 'freelancer' && (
                    <DropdownMenuItem onClick={() => navigate('/services')}>
                      <User className="mr-2 h-4 w-4" />
                      My Services
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Join as Freelancer
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-3">
            <button onClick={() => navigate('/home')} className="block text-sm font-medium hover:text-primary transition-colors text-left" role="link">
              Home
            </button>
            <button onClick={() => navigate('/services')} className="block text-sm font-medium hover:text-primary transition-colors text-left" role="link">
              Services
            </button>
            <button onClick={() => navigate('/search')} className="block text-sm font-medium hover:text-primary transition-colors text-left" role="link">
              Find Freelancers
            </button>
            <button onClick={() => navigate('/search')} className="block text-sm font-medium hover:text-primary transition-colors text-left" role="link">
              Categories
            </button>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="block text-sm font-medium hover:text-primary transition-colors text-left" role="link">
              How it Works
            </button>
            <div className="pt-3 space-y-2">
              {user ? (
                <>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/profile')}>
                    Profile Settings
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button className="w-full" onClick={() => navigate('/auth')}>
                    Join as Freelancer
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};