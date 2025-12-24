import { User, Product } from "./index";

export interface Video {
  id: string;
  user: User;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  comments: number;
  products?: Product[];
  isVerifiedBuyer?: boolean;
  timestamp: string;
}

export interface Short {
  id: string;
  user: User;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  products?: Product[];
  isVerifiedBuyer?: boolean;
  timestamp: string;
}

export interface Review {
  id: string;
  user: User;
  product: Product;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  videoUrl?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  timestamp: string;
}

export interface LiveSession {
  id: string;
  host: User;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  isLive: boolean;
  scheduledAt?: string;
  products?: Product[];
  category: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code?: string;
  product?: Product;
  expiresAt: string;
  imageUrl: string;
}

export type CommunityTab = 
  | "my-feed" 
  | "posts" 
  | "videos" 
  | "shorts" 
  | "reviews" 
  | "live" 
  | "offers";
