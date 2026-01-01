export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  isAuthentic?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
  followers: number;
  following: number;
  sales: number;
  trustScore: number;
  coins: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  bio?: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  product?: Product;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  user: User;
  thumbnail: string;
  type: 'image' | 'video';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}
