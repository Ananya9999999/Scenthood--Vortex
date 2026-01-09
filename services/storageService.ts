
import { UserProfile, Perfume, SavedRecommendation } from '../types';

/**
 * SCENTHOOD Database Service
 * Handles persistence for the application using the browser's local storage.
 */

const KEYS = {
  PROFILE: 'scenthood_db_profile',
  COLLECTION: 'scenthood_db_collection',
  HISTORY: 'scenthood_db_history'
};

export const database = {
  // User Profile "Table"
  saveProfile: (profile: UserProfile): void => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },
  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) return null;
    const profile = JSON.parse(data);
    if (!profile.blacklist) profile.blacklist = [];
    return profile;
  },

  // Perfume Collection "Table"
  saveCollection: (collection: Perfume[]): void => {
    localStorage.setItem(KEYS.COLLECTION, JSON.stringify(collection));
  },
  getCollection: (): Perfume[] => {
    const data = localStorage.getItem(KEYS.COLLECTION);
    return data ? JSON.parse(data) : [];
  },

  // Recommendation History "Table"
  saveToHistory: (entry: SavedRecommendation): void => {
    const history = database.getHistory();
    const newHistory = [entry, ...history].slice(0, 20);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
  },
  getHistory: (): SavedRecommendation[] => {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  // Database Maintenance
  wipeAll: (): void => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
};
