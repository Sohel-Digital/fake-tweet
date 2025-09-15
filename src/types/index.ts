// Core Tweet Data Structure
export interface TweetData {
  id: string;
  profile: ProfileData;
  content: ContentData;
  engagement: EngagementData;
  settings: SettingsData;
  createdAt: Date;
  updatedAt: Date;
}

// Profile Information
export interface ProfileData {
  username: string;
  displayName: string;
  avatar: string; // Base64 or URL
  verified: boolean;
  followers: string; // Formatted string like "150.2M"
  handle: string; // @username format
}

// Tweet Content
export interface ContentData {
  text: string;
  timestamp: Date;
  timeFormat: 'relative' | 'absolute';
  media?: MediaData[];
}

// Engagement Metrics
export interface EngagementData {
  likes: number;
  retweets: number;
  comments: number;
  quotes: number;
  views?: number;
}

// Application Settings
export interface SettingsData {
  theme: 'light' | 'dark';
  language: string;
  showMetrics: boolean;
  exportFormat: 'png' | 'jpg';
}

// Media Attachments (Future Enhancement)
export interface MediaData {
  type: 'image' | 'video' | 'gif';
  url: string;
  alt?: string;
}

// Export Configuration
export interface ExportConfig {
  format: 'png' | 'jpg';
  quality: number;
  scale: number;
}

// Stored in localStorage for persistence
export interface StoredTweetData {
  currentTweet: TweetData;
  recentTweets: TweetData[];
  userPreferences: SettingsData;
  lastExportConfig: ExportConfig;
}

// Component Props Interfaces
export interface TweetPreviewProps {
  tweetData: TweetData;
  className?: string;
  scale?: number;
}

export interface ProfileEditorProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

export interface ContentEditorProps {
  content: ContentData;
  onContentChange: (content: ContentData) => void;
  maxLength?: number;
}

export interface EngagementEditorProps {
  engagement: EngagementData;
  onEngagementChange: (engagement: EngagementData) => void;
}

export interface TimestampEditorProps {
  content: ContentData;
  onContentChange: (content: Partial<ContentData>) => void;
}

export interface UIState {
  isExporting: boolean;
  previewScale: number;
}

export interface UIActions {
  setIsExporting: (isExporting: boolean) => void;
  setPreviewScale: (scale: number) => void;
}

export interface ExportButtonProps {
  tweetData: TweetData;
  exportConfig?: ExportConfig;
  onExportConfigChange?: (config: ExportConfig) => void;
}