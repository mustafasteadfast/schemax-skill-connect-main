import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/layout/Navigation";
import { Send, User } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

interface ChatInfo {
  booking_id: string;
  client_id: string;
  freelancer_id: string;
  client_name: string;
  freelancer_name: string;
  service_title: string;
}

export default function Chat() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && bookingId) {
      loadChatInfo();
      loadMessages();
      setupRealtimeSubscription();
    }
  }, [user, bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatInfo = async () => {
    if (!bookingId || !user) return;

    try {
      // Mock chat info - in a real app, this would come from an API
      const mockChatInfo: ChatInfo = {
        booking_id: bookingId,
        client_id: user.role === 'client' ? user.id : 'client-123',
        freelancer_id: user.role === 'freelancer' ? user.id : 'freelancer-123',
        client_name: user.role === 'client' ? user.display_name : 'John Client',
        freelancer_name: user.role === 'freelancer' ? user.display_name : 'Jane Freelancer',
        service_title: 'Web Development Consultation',
      };

      setChatInfo(mockChatInfo);
    } catch (error: any) {
      toast({
        title: "Error loading chat",
        description: error.message,
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  };

  const loadMessages = async () => {
    if (!bookingId) return;

    try {
      // For now, we'll store messages in a mock format
      // In a real app, you'd have a separate messages table
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi! Looking forward to working with you.',
          sender_id: chatInfo?.freelancer_id || 'freelancer',
          sender_name: chatInfo?.freelancer_name || 'Freelancer',
          created_at: new Date().toISOString(),
        }
      ];
      
      setMessages(mockMessages);
    } catch (error: any) {
      console.error('Error loading messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    // In a real app, you'd subscribe to messages for this booking
    // For now, this is a placeholder
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatInfo || sending || !user) return;

    setSending(true);
    
    try {
      // Mock message sending - in a real app, you'd save the message to the database
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        sender_id: user.id,
        sender_name: user.display_name,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chatInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  const otherParticipant = chatInfo.client_id === user?.id 
    ? chatInfo.freelancer_name 
    : chatInfo.client_name;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Chat with {otherParticipant}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Service: {chatInfo.service_title}
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-muted/20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_id === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user?.id 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {format(new Date(message.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}