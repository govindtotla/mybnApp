// Business type definition
export interface Business {
    id: number;
    profilepic: string;
    business_name: string;
    slug: string;
    registered_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: number;
    managed_by: string;
    age: string;
    gender: string;
    description: string;
    phone: number;
    facebook_page: string;
    instagram: string;
    google_url: string;
    linked_in_page: string;
    website: string;
    updated_at: Date;
    created_at: Date;
    category: Category;
    location: {
        city_id: number,
        city_name: string,
        state_id: number,
        state_name: string,
        latitude: number,
        longitude: string,
    };
    banners: [{
        id: number,
        title: string,
        image: string,
    }];
    featured_banner: {
        id: number,
        title: string,
        image: string,
    };
    stats: {
        products_count: number,
        banners_count: number,
        is_verified: number,
        rating: number,
        total_views: number,
    };
  }

  // API Response types
  export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
  }

  export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }

  // Navigation types
  export type RootStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    BusinessList: undefined;
    BusinessDetail: { businessId: string; businessName?: string };
  };

  export interface Category {
      id: number,
      name: string,
      slug: string
  }