import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { mockFunctions } from "@/lib/mock-auth";
import { getServiceWithFreelancer } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/layout/Navigation";
import { Clock, Calendar, User } from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  freelancer_id: string;
}

interface Freelancer {
  display_name: string;
  avatar_url?: string | null;
}

export default function BookService() {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(location.state?.service || null);
  const [freelancer, setFreelancer] = useState<Freelancer | null>(location.state?.freelancer || null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!service && serviceId) {
      loadService();
    }
  }, [serviceId, service, navigate, user]);

  const loadService = async () => {
    if (!serviceId) return;

    // Use mock data
    const serviceData = getServiceWithFreelancer(serviceId);
    if (serviceData) {
      setService(serviceData);
      setFreelancer(serviceData.freelancer);
    } else {
      toast({
        title: "Service not found",
        description: "The requested service could not be found.",
        variant: "destructive",
      });
      navigate('/services');
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    // Use a base date for time formatting (doesn't matter which date since we only use time)
    const baseDate = new Date(2000, 0, 1); // January 1, 2000

    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = setMinutes(setHours(baseDate, hour), minute);
        slots.push(format(time, 'HH:mm'));
      }
    }
    return slots;
  };

  const handleBooking = async () => {
    if (!service || !user || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your booking.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

      // Validate the date/time combination
      if (isNaN(startDateTime.getTime())) {
        throw new Error('Invalid date or time selected. Please try again.');
      }

      // Check if the selected time is in the past (only for today)
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      if (selectedDate === todayString && startDateTime <= today) {
        throw new Error('Cannot book appointments in the past. Please select a future time.');
      }

      const endDateTime = new Date(startDateTime.getTime() + service.duration_minutes * 60000);

      const { data, error } = await mockFunctions.invoke('create-booking', {
        body: {
          freelancer_id: service.freelancer_id,
          service_id: service.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          notes: notes || null,
        },
      });

      if (error) {
        const serverMsg = (data as any)?.error || (data as any)?.message;
        throw new Error(serverMsg || error.message);
      }

      toast({
        title: "Booking requested!",
        description: "Your booking request has been sent to the freelancer. You'll be notified when they respond.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message || "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!service || !freelancer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>);
  }
    
  const timeSlots = generateTimeSlots();
  const tomorrow = addDays(new Date(), 1);
  const availableDates = Array.from({ length: 14 }, (_, i) => 
    format(addDays(tomorrow, i), 'yyyy-MM-dd')
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book Service</CardTitle>
            <CardDescription>Schedule your appointment with {freelancer.display_name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Details */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              {service.description && (
                <p className="text-muted-foreground mb-3">{service.description}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{freelancer.display_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration_minutes} mins</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-semibold text-lg">
                  <span>৳{(service.price_cents / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <select
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="">Choose a date</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time">Select Time</Label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                disabled={!selectedDate}
              >
                <option value="">Choose a time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or information for the freelancer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(`${selectedDate}T${selectedTime}`), 'EEEE, MMMM d, yyyy at h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {service.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Total: ৳{(service.price_cents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/services')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || isBooking}
                className="flex-1"
              >
                {isBooking ? "Booking..." : "Request Booking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}