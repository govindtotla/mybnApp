// API Configuration
export const API_CONFIG = {
    BASE_URL: 'https://mybn.in/api/v1/', // Free test API
    TIMEOUT: 10000,
    ENDPOINTS: {
      FEATURED_BUSINESSES: '/featured-businesses',
      BUSINESSES: '/businesses',
      CATEGORIES: '/categories',
      BUSINESS_DETAIL: '/business/',
      SEND_OTP: '/send-otp',
      VERIFY_OTP: '/verify-otp',
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
