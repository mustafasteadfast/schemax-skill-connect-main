import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { mockServices, getFreelancersWithSkills } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/layout/Navigation";
import { Plus, Clock, Star, User } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  freelancer_id: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  };
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadProfile();
    loadServices();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (user) {
      setProfile({
        id: user.id,
        display_name: user.display_name,
        role: user.role,
        hourly_rate: user.hourly_rate,
        bio: user.bio
      });
    }
  };

  const loadServices = async () => {
    try {
      const allServices = mockServices.filter(service => service.is_active);
      const freelancers = getFreelancersWithSkills();
      
      const servicesWithProfiles = allServices.map(service => {
        const freelancer = freelancers.find(f => f.id === service.freelancer_id);
        return {
          ...service,
          profiles: {
            display_name: freelancer?.display_name || 'Unknown',
            avatar_url: freelancer?.avatar_url || null
          }
        };
      });

      // Exclude user's own services
      const filteredServices = servicesWithProfiles.filter(service => 
        service.freelancer_id !== user?.id
      );

      setServices(filteredServices);
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

  const handleBookService = (service: Service) => {
    navigate(`/book/${service.id}`, { 
      state: { 
        service,
        freelancer: service.profiles 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Available Services</h1>
          <p className="text-muted-foreground">Find and book professional services</p>
        </div>

        {services.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-6">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No services available</h3>
                <p>Check back later for available services</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="shadow-card hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">{service.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{service.profiles.display_name}</span>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {service.duration_minutes} mins
                    </div>
                    <div className="flex items-center gap-1 font-medium text-lg">
                      ৳{(service.price_cents / 100).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (32 reviews)</span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleBookService(service)}
                  >
                    Book Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}