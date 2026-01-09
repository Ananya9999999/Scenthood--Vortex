
export type ProductType = 'PERFUME' | 'CANDLE';

export interface UserProfile {
  age: number;
  gender: string;
  weatherPreference: 'warm' | 'cold' | 'humid' | 'dry';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  country: string;
  occupation: string;
  minPrice: number;
  maxPrice: number;
  blacklist: string[];
  productType: ProductType;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  notes: string;
}

export interface Recommendation {
  collectionMatch: Perfume | null;
  newDiscovery: {
    name: string;
    brand: string;
    notes: string;
    price: string;
    currency: string;
    description: string;
    officialUrl: string;
    atomizingStrength: string; // New field for longevity/sillage or candle throw
    isLocalBrand?: boolean;
  };
}

export interface SavedRecommendation {
  id: string;
  timestamp: number;
  recommendation: Recommendation;
  imageUrl: string | null;
  context: {
    mood: string;
    occasion?: string;
    productType: ProductType;
  };
}

export type AppState = 'LANDING' | 'PRODUCT_SELECTION' | 'REGISTRATION' | 'COLLECTION' | 'DASHBOARD';
