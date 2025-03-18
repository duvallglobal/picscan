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
  productId: string;
  confidence: number;
  labels: string[];
  metadata: Record<string, any>;
  createdAt: Date;
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

