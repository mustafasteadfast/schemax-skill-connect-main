import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/layout/Navigation";
import { ArrowLeft, Calendar, Clock, Plus, Trash2 } from "lucide-react";

interface AvailabilitySlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
}

export default function Availability() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user is a freelancer
    if (user.role !== 'freelancer') {
      navigate('/dashboard');
      return;
    }

    loadAvailability();
  }, [user, navigate]);

  const loadAvailability = async () => {
    try {
      if (!user) return;

      // Mock availability data - in a real app, this would come from an API
      const mockSlots: AvailabilitySlot[] = [
        {
          id: 'slot-1',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // Tomorrow + 2 hours
          is_booked: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'slot-2',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // Day after tomorrow + 3 hours
          is_booked: true,
          created_at: new Date().toISOString()
        }
      ];

      setSlots(mockSlots);
    } catch (error: any) {
      toast({
        title: "Error loading availability",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAvailabilitySlot = async () => {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const startDateTime = new Date(`${newSlot.date}T${newSlot.start_time}`);
    const endDateTime = new Date(`${newSlot.date}T${newSlot.end_time}`);

    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (!user) return;

      // Mock add availability - in a real app, this would call an API
      const newSlotData: AvailabilitySlot = {
        id: `slot-${Date.now()}`,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        is_booked: false,
        created_at: new Date().toISOString()
      };

      setSlots(prev => [...prev, newSlotData]);

      toast({
        title: "Availability added",
        description: "Your availability slot has been added successfully.",
      });

      setNewSlot({ date: '', start_time: '', end_time: '' });
    } catch (error: any) {
      toast({
        title: "Error adding availability",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      // Mock delete availability - in a real app, this would call an API
      setSlots(prev => prev.filter(slot => slot.id !== slotId));

      toast({
        title: "Slot deleted",
        description: "Availability slot has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting slot",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Manage Availability</h1>
              <p className="text-muted-foreground">Set your available time slots for client bookings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Slot */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Availability Slot
                </CardTitle>
                <CardDescription>
                  Create a new time slot when you're available for bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSlot.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  onClick={addAvailabilitySlot} 
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? 'Adding...' : 'Add Availability Slot'}
                </Button>
              </CardContent>
            </Card>

            {/* Current Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your Availability
                </CardTitle>
                <CardDescription>
                  Manage your upcoming availability slots
                </CardDescription>
              </CardHeader>
              <CardContent>
                {slots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No availability slots set</p>
                    <p className="text-sm">Add your first slot to start receiving bookings</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {slots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                              {formatDateTime(slot.start_time)}
                            </span>
                            <span className="text-muted-foreground">to</span>
                            <span className="font-medium">
                              {new Date(slot.end_time).toLocaleTimeString()}
                            </span>
                          </div>
                          <Badge variant={slot.is_booked ? 'secondary' : 'default'}>
                            {slot.is_booked ? 'Booked' : 'Available'}
                          </Badge>
                        </div>
                        {!slot.is_booked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSlot(slot.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}