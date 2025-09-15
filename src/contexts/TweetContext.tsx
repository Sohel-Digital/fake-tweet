import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TweetData, ProfileData, ContentData, EngagementData, SettingsData } from '../types';

// Default data
const defaultProfile: ProfileData = {
  username: 'elonmusk',
  displayName: 'Elon Musk',
  avatar: '',
  verified: true,
  followers: '150.2M',
  handle: '@elonmusk'
};

const defaultContent: ContentData = {
  text: 'Just launched another rocket! 🚀',
  timestamp: new Date(),
  timeFormat: 'relative'
};

const defaultEngagement: EngagementData = {
  likes: 125000,
  retweets: 45000,
  comments: 8500,
  quotes: 2100,
  views: 1200000
};

const defaultSettings: SettingsData = {
  theme: 'light',
  language: 'en',
  showMetrics: true,
  exportFormat: 'png'
};

const defaultTweetData: TweetData = {
  id: '1',
  profile: defaultProfile,
  content: defaultContent,
  engagement: defaultEngagement,
  settings: defaultSettings,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Zustand store interface
interface TweetStore {
  tweetData: TweetData;
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateContent: (content: Partial<ContentData>) => void;
  updateEngagement: (engagement: Partial<EngagementData>) => void;
  updateSettings: (settings: Partial<SettingsData>) => void;
  resetTweet: () => void;
  loadTweet: (tweetData: TweetData) => void;
}

// Helper function to ensure dates are properly converted
const ensureDateObject = (value: any): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  return new Date();
};

// Helper function to convert stored data back to proper types
const deserializeTweetData = (storedData: any): TweetData => {
  if (!storedData) return defaultTweetData;
  
  return {
    ...storedData,
    content: {
      ...storedData.content,
      timestamp: ensureDateObject(storedData.content?.timestamp)
    },
    createdAt: ensureDateObject(storedData.createdAt),
    updatedAt: ensureDateObject(storedData.updatedAt)
  };
};

// Create Zustand store with persistence
export const useTweetStore = create<TweetStore>()(
  persist(
    (set, get) => ({
      tweetData: defaultTweetData,
      
      updateProfile: (profile: Partial<ProfileData>) => {
        set((state) => ({
          tweetData: {
            ...state.tweetData,
            profile: { ...state.tweetData.profile, ...profile },
            updatedAt: new Date()
          }
        }));
      },
      
      updateContent: (content: Partial<ContentData>) => {
        set((state) => ({
          tweetData: {
            ...state.tweetData,
            content: { 
              ...state.tweetData.content, 
              ...content,
              // Ensure timestamp is always a Date object
              timestamp: content.timestamp ? ensureDateObject(content.timestamp) : state.tweetData.content.timestamp
            },
            updatedAt: new Date()
          }
        }));
      },
      
      updateEngagement: (engagement: Partial<EngagementData>) => {
        set((state) => ({
          tweetData: {
            ...state.tweetData,
            engagement: { ...state.tweetData.engagement, ...engagement },
            updatedAt: new Date()
          }
        }));
      },
      
      updateSettings: (settings: Partial<SettingsData>) => {
        set((state) => ({
          tweetData: {
            ...state.tweetData,
            settings: { ...state.tweetData.settings, ...settings },
            updatedAt: new Date()
          }
        }));
      },
      
      resetTweet: () => {
        set({ tweetData: { ...defaultTweetData, id: Date.now().toString() } });
      },
      
      loadTweet: (tweetData: TweetData) => {
        set({ tweetData: deserializeTweetData(tweetData) });
      }
    }),
    {
      name: 'fake-tweet-storage',
      partialize: (state) => ({ tweetData: state.tweetData }),
      onRehydrateStorage: () => (state) => {
        if (state?.tweetData) {
          state.tweetData = deserializeTweetData(state.tweetData);
        }
      }
    }
  )
);

// React Context for additional UI state
interface UIContextType {
  isExporting: boolean;
  setIsExporting: (exporting: boolean) => void;
  previewScale: number;
  setPreviewScale: (scale: number) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [previewScale, setPreviewScale] = React.useState(1);

  return (
    <UIContext.Provider value={{
      isExporting,
      setIsExporting,
      previewScale,
      setPreviewScale
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};