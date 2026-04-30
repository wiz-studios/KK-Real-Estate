// Database Types
export type UserRole = 'admin' | 'user';

export type PropertyType = 
  | 'bungalow'
  | 'flatroof'
  | 'townhouse'
  | 'apartment'
  | 'penthouse'
  | 'villa'
  | 'mansion'
  | 'cottage'
  | 'duplex'
  | 'studio';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'under_review';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency: string;
  
  // Room Details
  totalRooms: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  kitchens: number;
  
  // Specifications
  plotSize?: string;
  builtArea?: string;
  constructionYear?: number;
  
  // Verification
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  
  // Admin Info
  addedBy: string;
  isAvailable: boolean;
  viewsCount: number;
  images: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  inquiryCount?: number;
  latestInquiry?: PropertyInquirySummary;
}

export interface PropertyFeature {
  id: string;
  propertyId: string;
  featureName: string;
  featureValue?: string;
  category?: string;
  createdAt: string;
}

export interface VerificationLog {
  id: string;
  propertyId: string;
  adminId: string;
  action: string;
  status: VerificationStatus;
  notes?: string;
  verificationDate?: string;
  createdAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  userId: string;
  inquiryType?: string;
  message?: string;
  phone?: string;
  createdAt: string;
}

export interface PropertyInquirySummary {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

export interface AdminInquiryItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity?: string;
  propertyCounty?: string;
  propertyImage?: string;
  propertyVerificationNotes?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  inquiryType?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// Auth Session
export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Filter Types for Properties
export interface PropertyFilters {
  city?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}
