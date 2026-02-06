import axios from 'axios';
import { API_CONFIG } from '../utils/constants';
import { Business, PaginatedResponse } from '../utils/types';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Simulate API delay for realistic loading states
const simulateDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Business Service
export const businessService = {
  // Get all businesses with pagination
  getBusinesses: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Business>> => {
    try {
      await simulateDelay(800); // Simulate network delay

      // For demo purposes, using mock data
      // In production, replace with:
      const response = await api.get(API_CONFIG.ENDPOINTS.BUSINESSES, {
        params: { _page: page, _limit: limit }
      });
      const BUSINESSES = response.data.data;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = BUSINESSES.slice(startIndex, endIndex);

      return {
        items: paginatedItems,
        page,
        limit,
        total: BUSINESSES.length,
        totalPages: Math.ceil(BUSINESSES.length / limit),
      };
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  // Get business by ID
  getBusinessById: async (id: number): Promise<Business> => {
    try {
      await simulateDelay(500);

      const response = await api.get(API_CONFIG.ENDPOINTS.BUSINESS_DETAIL + id);
      const business = response.data.data;
      if (!business) {
        // In production, use: await api.get(`${API_CONFIG.ENDPOINTS.BUSINESS_BY_ID}/${id}`);
        throw new Error(`Business with ID ${id} not found`);
      }

      return business;
    } catch (error) {
      console.error(`Error fetching business ${id}:`, error);
      throw error;
    }
  },

  // Search businesses
  searchBusinesses: async (
    query: string,
    category?: string
  ): Promise<Business[]> => {
    try {
      await simulateDelay(600);

      let results = MOCK_BUSINESSES;

      // Apply search query
      if (query.trim()) {
        const searchLower = query.toLowerCase();
        results = results.filter(business =>
          business.name.toLowerCase().includes(searchLower) ||
          business.description.toLowerCase().includes(searchLower) ||
          business.category.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (category && category !== 'All') {
        results = results.filter(business => business.category === category);
      }

      return results;
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  },

  // Get businesses by category
  getBusinessesByCategory: async (category: string): Promise<Business[]> => {
    try {
      await simulateDelay(400);

      if (category === 'All') {
        return MOCK_BUSINESSES;
      }

      return MOCK_BUSINESSES.filter(business => business.category === category);
    } catch (error) {
      console.error(`Error fetching businesses by category ${category}:`, error);
      throw error;
    }
  },
};

export default api;