import { MockUser, DEMO_CREDENTIALS, mockUsers } from './mock-data';

export interface AuthState {
  user: MockUser | null;
  loading: boolean;
}

export interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Mock authentication class
export class MockAuth {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  // Simulate async operations
  async signIn(email: string, password: string): Promise<{ data: { user: MockUser } | null, error: any }> {
    await this.delay(1000); // Simulate network delay

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      this.currentUser = mockUsers.find(u => u.email === email) || null;
      this.notifyListeners();
      return { data: { user: this.currentUser! }, error: null };
    }

    return { data: null, error: { message: 'Invalid email or password' } };
  }

  async signUp(email: string, password: string, displayName: string): Promise<{ data: { user: MockUser } | null, error: any }> {
    await this.delay(1000);

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return { data: null, error: { message: 'User already exists' } };
    }

    // Create new user
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      display_name: displayName,
      role: 'client',
      is_public: true
    };

    // Add to mock users (in a real app, this would be persisted)
    mockUsers.push(newUser);
    this.currentUser = newUser;
    this.notifyListeners();

    return { data: { user: newUser }, error: null };
  }

  async signOut(): Promise<void> {
    await this.delay(500);
    this.currentUser = null;
    this.notifyListeners();
  }

  getUser(): MockUser | null {
    return this.currentUser;
  }

  getSession(): { data: { session: { user: MockUser } | null } } {
    return {
      data: {
        session: this.currentUser ? { user: this.currentUser } : null
      }
    };
  }

  onAuthStateChange(callback: (event: string, session: { user: MockUser } | null) => void) {
    const listener = (user: MockUser | null) => {
      callback('SIGNED_IN', user ? { user } : null);
    };

    this.listeners.push(listener);

    // Return unsubscribe function
    return {
      data: { subscription: { unsubscribe: () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      }}}
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
export const mockAuth = new MockAuth();

// Mock functions that mimic Supabase functions
export const mockFunctions = {
  invoke: async (functionName: string, options: { body: any }) => {
    await mockAuth.delay(1000);

    if (functionName === 'create-booking') {
      // Mock booking creation
      return {
        data: {
          success: true,
          booking: {
            id: `booking-${Date.now()}`,
            ...options.body,
            status: 'pending',
            created_at: new Date().toISOString()
          },
          message: 'Booking created successfully'
        },
        error: null
      };
    }

    if (functionName === 'search-freelancers') {
      // Mock freelancer search
      const freelancers = mockUsers
        .filter(u => u.role === 'freelancer')
        .map(freelancer => ({
          ...freelancer,
          avg_rating: 4.5,
          review_count: 10,
          skills: ['React', 'TypeScript'],
          services: []
        }));

      return {
        data: {
          success: true,
          freelancers,
          total: freelancers.length
        },
        error: null
      };
    }

    return { data: null, error: { message: 'Function not implemented' } };
  }
};
