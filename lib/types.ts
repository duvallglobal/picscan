export interface ProductListing {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductAnalysis {
  id: string;
  title: string;
  description: string;
  suggestedPrice: number;
  imageUrl: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  similarProducts: SimilarProduct[];
  competitorProducts: SimilarProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SimilarProduct {
  title: string;
  price: number;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MarketplaceListing {
  platform: string
  productId: string
  status: "draft" | "published" | "error"
  url?: string
  error?: string
}

export interface PhotoEnhancementResult {
  url: string
  width: number
  height: number
  size: number
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface NotificationState {
  messages: ToastMessage[];
}

