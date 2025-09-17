// Mock data for frontend showcase

export interface MockUser {
  id: string;
  email: string;
  display_name: string;
  role: 'client' | 'freelancer';
  avatar_url?: string;
  hourly_rate?: number;
  location?: string;
  bio?: string;
  is_public: boolean;
  is_verified?: boolean;
}

export interface MockService {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  freelancer_id: string;
  is_active: boolean;
  category_id?: string;
  subcategory_id?: string;
}

export interface MockBooking {
  id: string;
  client_id: string;
  freelancer_id: string;
  service_id?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount_cents?: number;
  currency: string;
  payment_status: 'unpaid' | 'paid';
  notes?: string;
  created_at: string;
}

export interface MockSkill {
  id: string;
  name: string;
}

export interface MockCategory {
  id: string;
  name: string;
  icon: string;
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    display_name: 'John Doe',
    role: 'freelancer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    hourly_rate: 75,
    location: 'Dhaka, Bangladesh',
    bio: 'Experienced web developer with 5+ years in React and Node.js',
    is_public: true,
    is_verified: true
  },
  {
    id: 'user-2',
    email: 'sarah.smith@example.com',
    display_name: 'Sarah Smith',
    role: 'freelancer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c2?w=150&h=150&fit=crop&crop=face',
    hourly_rate: 90,
    location: 'Chittagong, Bangladesh',
    bio: 'UI/UX Designer specializing in mobile and web applications',
    is_public: true,
    is_verified: true
  },
  {
    id: 'user-3',
    email: 'mike.johnson@example.com',
    display_name: 'Mike Johnson',
    role: 'freelancer',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    hourly_rate: 60,
    location: 'Khulna, Bangladesh',
    bio: 'Full-stack developer with expertise in Python and Django',
    is_public: true,
    is_verified: false
  },
  {
    id: 'user-4',
    email: 'client@example.com',
    display_name: 'Alice Wilson',
    role: 'client',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: 'Dhaka, Bangladesh',
    bio: 'Startup founder looking for talented developers',
    is_public: true
  },
  {
    id: 'user-5',
    email: 'demo@example.com',
    display_name: 'Demo User',
    role: 'client',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    location: 'Dhaka, Bangladesh',
    bio: 'Demo user for showcasing the platform',
    is_public: true
  }
];

// Mock Skills
export const mockSkills: MockSkill[] = [
  { id: 'skill-1', name: 'React' },
  { id: 'skill-2', name: 'TypeScript' },
  { id: 'skill-3', name: 'Node.js' },
  { id: 'skill-4', name: 'Python' },
  { id: 'skill-5', name: 'UI/UX Design' },
  { id: 'skill-6', name: 'Figma' },
  { id: 'skill-7', name: 'Django' },
  { id: 'skill-8', name: 'PostgreSQL' },
  { id: 'skill-9', name: 'MongoDB' },
  { id: 'skill-10', name: 'AWS' }
];

// Mock Categories
export const mockCategories: MockCategory[] = [
  { id: 'cat-1', name: 'Web Development', icon: 'Globe' },
  { id: 'cat-2', name: 'Mobile Development', icon: 'Smartphone' },
  { id: 'cat-3', name: 'UI/UX Design', icon: 'Palette' },
  { id: 'cat-4', name: 'Data Science', icon: 'BarChart3' },
  { id: 'cat-5', name: 'DevOps', icon: 'Settings' },
  { id: 'cat-6', name: 'Writing', icon: 'PenTool' }
];

// Mock Services
export const mockServices: MockService[] = [
  {
    id: 'service-1',
    title: 'React Web Application Development',
    description: 'Build modern, responsive web applications using React and TypeScript',
    price_cents: 50000, // 500 BDT
    duration_minutes: 120,
    freelancer_id: 'user-1',
    is_active: true,
    category_id: 'cat-1'
  },
  {
    id: 'service-2',
    title: 'Mobile UI/UX Design',
    description: 'Create beautiful and intuitive mobile app designs',
    price_cents: 75000, // 750 BDT
    duration_minutes: 90,
    freelancer_id: 'user-2',
    is_active: true,
    category_id: 'cat-3'
  },
  {
    id: 'service-3',
    title: 'Python Backend API',
    description: 'Develop robust REST APIs using Python and Django',
    price_cents: 40000, // 400 BDT
    duration_minutes: 150,
    freelancer_id: 'user-3',
    is_active: true,
    category_id: 'cat-1'
  },
  {
    id: 'service-4',
    title: 'React Native Mobile App',
    description: 'Cross-platform mobile application development',
    price_cents: 80000, // 800 BDT
    duration_minutes: 180,
    freelancer_id: 'user-1',
    is_active: true,
    category_id: 'cat-2'
  },
  {
    id: 'service-5',
    title: 'Website Redesign',
    description: 'Complete website redesign with modern UI/UX principles',
    price_cents: 60000, // 600 BDT
    duration_minutes: 240,
    freelancer_id: 'user-2',
    is_active: true,
    category_id: 'cat-3'
  }
];

// Mock Bookings
export const mockBookings: MockBooking[] = [
  {
    id: 'booking-1',
    client_id: 'user-4',
    freelancer_id: 'user-1',
    service_id: 'service-1',
    start_time: '2025-01-15T10:00:00Z',
    end_time: '2025-01-15T12:00:00Z',
    status: 'confirmed',
    total_amount_cents: 50000,
    currency: 'bdt',
    payment_status: 'paid',
    notes: 'Need the app to be mobile-responsive',
    created_at: '2025-01-10T09:00:00Z'
  },
  {
    id: 'booking-2',
    client_id: 'user-5',
    freelancer_id: 'user-2',
    service_id: 'service-2',
    start_time: '2025-01-20T14:00:00Z',
    end_time: '2025-01-20T15:30:00Z',
    status: 'pending',
    total_amount_cents: 75000,
    currency: 'bdt',
    payment_status: 'unpaid',
    notes: 'Looking for modern design trends',
    created_at: '2025-01-12T11:00:00Z'
  }
];

// Mock Freelancer Skills Relationship
export const mockFreelancerSkills = [
  { freelancer_id: 'user-1', skill_id: 'skill-1' },
  { freelancer_id: 'user-1', skill_id: 'skill-2' },
  { freelancer_id: 'user-1', skill_id: 'skill-3' },
  { freelancer_id: 'user-2', skill_id: 'skill-5' },
  { freelancer_id: 'user-2', skill_id: 'skill-6' },
  { freelancer_id: 'user-3', skill_id: 'skill-4' },
  { freelancer_id: 'user-3', skill_id: 'skill-7' },
  { freelancer_id: 'user-3', skill_id: 'skill-8' }
];

// Demo credentials
export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123'
};

// Helper functions
export const getFreelancersWithSkills = () => {
  return mockUsers
    .filter(user => user.role === 'freelancer')
    .map(freelancer => {
      const skills = mockFreelancerSkills
        .filter(fs => fs.freelancer_id === freelancer.id)
        .map(fs => mockSkills.find(skill => skill.id === fs.skill_id))
        .filter(Boolean);

      const services = mockServices.filter(service => service.freelancer_id === freelancer.id);

      // Calculate average rating (mock)
      const avgRating = Math.random() * 2 + 3; // 3-5 stars

      return {
        ...freelancer,
        skills,
        services,
        avg_rating: Number(avgRating.toFixed(1)),
        review_count: Math.floor(Math.random() * 50) + 5
      };
    });
};

export const getServiceWithFreelancer = (serviceId: string) => {
  const service = mockServices.find(s => s.id === serviceId);
  if (!service) return null;

  const freelancer = mockUsers.find(u => u.id === service.freelancer_id);
  if (!freelancer) return null;

  const skills = mockFreelancerSkills
    .filter(fs => fs.freelancer_id === freelancer.id)
    .map(fs => mockSkills.find(skill => skill.id === fs.skill_id))
    .filter(Boolean);

  return {
    ...service,
    freelancer: {
      ...freelancer,
      skills
    }
  };
};

export const getBookingsForUser = (userId: string) => {
  const userBookings = mockBookings.filter(booking =>
    booking.client_id === userId || booking.freelancer_id === userId
  );

  return userBookings.map(booking => {
    const freelancer = mockUsers.find(u => u.id === booking.freelancer_id);
    const service = booking.service_id ? mockServices.find(s => s.id === booking.service_id) : null;

    return {
      ...booking,
      freelancer: freelancer ? {
        display_name: freelancer.display_name,
        avatar_url: freelancer.avatar_url
      } : null,
      service: service ? {
        title: service.title,
        description: service.description
      } : null
    };
  });
};
