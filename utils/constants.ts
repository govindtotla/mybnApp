// API Configuration
export const API_CONFIG = {
    BASE_URL: 'https://mybn.in/api/v1/', // Free test API
    TIMEOUT: 10000,
    ENDPOINTS: {
      FEATURED_BUSINESSES: '/featured-businesses',
      BUSINESSES: '/businesses',
      CATEGORIES: '/categories',
      BUSINESS_DETAIL: '/business/',
    },
  };


  // App Constants
  export const APP_CONSTANTS = {
    APP_NAME: 'MYBN',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'developewithgovind@gmail.com',
  };

  // Colors
  export const COLORS = {
    primary: '#4A90E2',      // Blue
    secondary: '#50C878',    // Green
    tertiary: '#FF6B6B',     // Red
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
      light: '#B2BEC3',
      inverted: '#FFFFFF',
    },
    border: '#DFE6E9',
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E17055',
    white: '#FFFFFF',
    gradient: {
      start: '#4A90E2',
      end: '#50C878',
    },
  };

  // Mock Data for Development
  export const MOCK_BUSINESSES = [
    {
      id: '1',
      name: 'Tech Solutions Inc.',
      category: 'Technology',
      address: '123 Main Street, San Francisco, CA 94105',
      phone: '(415) 123-4567',
      email: 'info@techsolutions.com',
      website: 'https://techsolutions.com',
      description: 'Leading technology solutions provider specializing in software development, cloud computing, and IT consulting services for businesses of all sizes.',
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
      hours: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      id: '2',
      name: 'Green Leaf Restaurant',
      category: 'Food & Dining',
      address: '456 Oak Avenue, New York, NY 10001',
      phone: '(212) 987-6543',
      email: 'contact@greenleaf.com',
      website: 'https://greenleafrestaurant.com',
      description: 'Farm-to-table restaurant serving organic, locally sourced cuisine in a cozy atmosphere. Specializing in seasonal dishes and craft cocktails.',
      rating: 4.8,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      hours: ['Monday - Sunday: 11:00 AM - 10:00 PM', 'Brunch: Saturday & Sunday: 10:00 AM - 3:00 PM'],
      latitude: 40.7128,
      longitude: -74.0060,
    },
    {
      id: '3',
      name: 'Urban Fitness Center',
      category: 'Health & Fitness',
      address: '789 Fitness Way, Chicago, IL 60601',
      phone: '(312) 555-7890',
      email: 'membership@urbanfitness.com',
      website: 'https://urbanfitnesscenter.com',
      description: 'State-of-the-art fitness facility with modern equipment, group classes, personal training, and wellness programs for all fitness levels.',
      rating: 4.3,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      hours: ['Monday - Friday: 5:00 AM - 11:00 PM', 'Saturday - Sunday: 6:00 AM - 9:00 PM'],
      latitude: 41.8781,
      longitude: -87.6298,
    },
    {
      id: '4',
      name: 'Creative Design Studio',
      category: 'Design & Creative',
      address: '101 Design Blvd, Austin, TX 73301',
      phone: '(512) 456-7890',
      email: 'hello@creativedesign.com',
      website: 'https://creativedesignstudio.com',
      description: 'Full-service design agency offering branding, web design, UI/UX, and marketing materials for innovative companies and startups.',
      rating: 4.7,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      hours: ['Monday - Friday: 8:00 AM - 6:00 PM', 'By appointment on weekends'],
      latitude: 30.2672,
      longitude: -97.7431,
    },
    {
      id: '5',
      name: 'Swift Logistics',
      category: 'Logistics & Transport',
      address: '202 Shipping Lane, Miami, FL 33101',
      phone: '(305) 333-4444',
      email: 'support@swiftlogistics.com',
      website: 'https://swiftlogistics.com',
      description: 'Reliable logistics and transportation services offering local, national, and international shipping solutions with real-time tracking.',
      rating: 4.2,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      hours: ['Monday - Friday: 8:00 AM - 8:00 PM', 'Saturday: 9:00 AM - 5:00 PM', 'Sunday: Closed'],
      latitude: 25.7617,
      longitude: -80.1918,
    },
  ];

  // Categories for filtering
  export const CATEGORIES = [
    'All',
    'Technology',
    'Food & Dining',
    'Health & Fitness',
    'Design & Creative',
    'Logistics & Transport',
    'Retail',
    'Services',
    'Education',
    'Healthcare',
  ];

  // Screen names
  export const SCREENS = {
    SPLASH: 'Splash',
    WELCOME: 'Welcome',
    BUSINESS_LIST: 'BusinessList',
    BUSINESS_DETAIL: 'BusinessDetail',
  } as const;