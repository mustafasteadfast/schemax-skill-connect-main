import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { mockServices, getBookingsForUser } from "@/lib/mock-data";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, Star, Clock, TrendingUp, Eye } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'paused' | 'draft';
}

interface Profile {
  id: string;
  display_name: string;
  hourly_rate: number;
  bio: string;
}

export default function FreelancerHome() {
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    activeServices: 0,
    totalEarnings: 0,
    profileViews: 0,
    rating: 0,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProfile();
      loadServices();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    if (user) {
      setProfile({
        id: user.id,
        display_name: user.display_name,
        hourly_rate: user.hourly_rate || 75,
        bio: user.bio || 'Experienced freelancer ready to help with your projects.'
      });
    }
  };

  const loadServices = async () => {
    if (user) {
      // Use mock services for this freelancer
      const userServices = mockServices
        .filter(service => service.freelancer_id === user.id)
        .map(service => ({
          id: service.id,
          title: service.title,
          description: service.description || '',
          price: service.price_cents / 100,
          status: (service.is_active ? 'active' : 'paused') as 'active' | 'paused' | 'draft'
        }));

      setServices(userServices);
    }
  };

  const loadStats = async () => {
    if (user) {
      // Calculate stats from mock data
      const activeServicesCount = services.filter(s => s.status === 'active').length;
      const bookings = getBookingsForUser(user.id);
      const completedBookings = bookings.filter(b => b.status === 'completed');

      setStats({
        activeServices: activeServicesCount,
        totalEarnings: completedBookings.reduce((sum, booking) => sum + (booking.total_amount_cents || 0), 0) / 100,
        profileViews: Math.floor(Math.random() * 1000) + 500, // Mock views
        rating: 4.8, // Mock rating
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Welcome back, {profile?.display_name || 'Freelancer'}!
            </h1>
            <p className="text-muted-foreground text-lg">Manage your services and grow your business</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/services/new')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Service
            </Button>
            <Button variant="outline" onClick={() => navigate('/services')}>
              Manage Services
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold">{stats.activeServices}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">৳{stats.totalEarnings}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Eye className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{stats.profileViews}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Star className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{stats.rating}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        {(!profile?.bio || !profile?.hourly_rate) && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-orange-800">Complete Your Profile</CardTitle>
              <CardDescription className="text-orange-600">
                A complete profile helps you attract more clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-orange-700">
                    {!profile?.bio && !profile?.hourly_rate
                      ? "Add your bio and hourly rate to get started"
                      : !profile?.bio
                      ? "Add a bio to showcase your expertise"
                      : "Set your hourly rate to start earning"}
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Your Services</CardTitle>
              <CardDescription>Manage and track your service offerings</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/services')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No services yet</h3>
                  <p className="text-muted-foreground">Create your first service to start earning</p>
                </div>
                <Button onClick={() => navigate('/services/new')}>
                  Create Your First Service
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg line-clamp-2">{service.title}</h3>
                        <Badge 
                          variant={service.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2 flex-shrink-0"
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">৳{service.price}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          0 orders
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to grow your freelance business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/services/new')}>
                <Plus className="w-6 h-6 mb-2" />
                Create New Service
              </Button>
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/profile')}>
                <TrendingUp className="w-6 h-6 mb-2" />
                Update Profile
              </Button>
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/search')}>
                <Eye className="w-6 h-6 mb-2" />
                Browse Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}