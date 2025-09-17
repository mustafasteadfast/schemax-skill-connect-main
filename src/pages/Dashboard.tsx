import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Calendar, 
  DollarSign, 
  Star, 
  Bell,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

// Services Tab Component
function ServicesTab({ profile, navigate }: { profile: Profile; navigate: any }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.role === 'freelancer') {
      loadServices();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const loadServices = async () => {
    try {
      // Mock services data - in a real app, this would come from an API
      const mockServices: Service[] = [
        {
          id: 'service-1',
          title: 'Web Development',
          description: 'Custom web applications using React and Node.js',
          price_cents: 500000, // ৳5000
          duration_minutes: 120,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'service-2',
          title: 'UI/UX Design',
          description: 'Modern and responsive user interface design',
          price_cents: 300000, // ৳3000
          duration_minutes: 90,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      setServices(mockServices);
    } catch (error: any) {
      toast({
        title: "Error loading services",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      // Mock update - in a real app, this would call an API
      setServices(services.map(service => 
        service.id === serviceId 
          ? { ...service, is_active: !currentStatus }
          : service
      ));

      toast({
        title: "Service updated",
        description: `Service ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (profile.role === 'client') {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Browse Services</CardTitle>
          <CardDescription>Find the perfect service for your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start browsing services</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/search')}
            >
              Browse Freelancers
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>My Services</CardTitle>
          <CardDescription>Manage your service offerings</CardDescription>
        </div>
        <Button onClick={() => navigate('/services/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Service
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No services created yet</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/services/new')}
            >
              Create Your First Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{service.title}</h3>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>৳{(service.price_cents / 100).toFixed(2)}</span>
                    <span>{service.duration_minutes} minutes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                  >
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/services')}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface Profile {
  id: string;
  display_name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  role: 'client' | 'freelancer';
  hourly_rate: number | null;
  is_public: boolean;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Convert MockUser to Profile format
    const profileData: Profile = {
      id: user.id,
      display_name: user.display_name,
      bio: null,
      location: null,
      avatar_url: user.avatar_url || null,
      role: user.role,
      hourly_rate: null,
      is_public: user.is_public
    };

    setProfile(profileData);
    setLoading(false);
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="shadow-card border-card-border">
              <CardHeader className="text-center pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{profile.display_name}</CardTitle>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Badge variant={profile.role === 'freelancer' ? 'default' : 'secondary'}>
                    {profile.role === 'freelancer' ? 'Freelancer' : 'Client'}
                  </Badge>
                  {profile.is_public && <Badge variant="outline">Public Profile</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.location && (
                  <div className="text-sm text-muted-foreground">
                    📍 {profile.location}
                  </div>
                )}
                {profile.hourly_rate && (
                  <div className="text-sm">
                    💰 ৳{profile.hourly_rate}/hour
                  </div>
                )}
                {profile.bio && (
                  <div className="text-sm text-muted-foreground">
                    {profile.bio}
                  </div>
                )}
                
                <div className="pt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/profile')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile.display_name}!
              </h1>
              <p className="text-muted-foreground">
                {profile.role === 'freelancer' 
                  ? "Manage your services, bookings, and grow your business."
                  : "Find talented freelancers and manage your projects."
                }
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="services">
                  {profile.role === 'freelancer' ? 'My Services' : 'Browse'}
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="w-4 h-4 mr-1" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {profile.role === 'freelancer' ? 'Active Bookings' : 'Hired Freelancers'}
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">No active bookings yet</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {profile.role === 'freelancer' ? 'Earnings' : 'Spent'}
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">৳0</div>
                      <p className="text-xs text-muted-foreground">
                        {profile.role === 'freelancer' ? 'Total earnings' : 'Total spent'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Rating</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">-</div>
                      <p className="text-xs text-muted-foreground">No reviews yet</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with SchemaX</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.role === 'freelancer' ? (
                      <>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col"
                          onClick={() => navigate('/services/new')}
                        >
                          <Plus className="w-6 h-6 mb-2" />
                          Create Service
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col"
                          onClick={() => navigate('/availability')}
                        >
                          <Calendar className="w-6 h-6 mb-2" />
                          Set Availability
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col"
                          onClick={() => navigate('/search')}
                        >
                          <Search className="w-6 h-6 mb-2" />
                          Find Freelancers
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-20 flex-col"
                          onClick={() => navigate('/categories')}
                        >
                          <Filter className="w-6 h-6 mb-2" />
                          Browse Categories
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                      {profile.role === 'freelancer' 
                        ? "Manage your client bookings"
                        : "Track your hired freelancers"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No bookings yet</p>
                      <p className="text-sm">
                        {profile.role === 'freelancer' 
                          ? "Create services to start receiving bookings"
                          : "Browse freelancers to make your first booking"
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <ServicesTab profile={profile} navigate={navigate} />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated with your latest activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications yet</p>
                      <p className="text-sm">We'll notify you about important updates</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}