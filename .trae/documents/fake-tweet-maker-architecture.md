# Fake Tweet Maker - Technical Architecture Document

## 1. Architecture Design

```mermaid
graph TD
  A[User Browser] --> B[Next.js Frontend Application]
  B --> C[React Components]
  B --> D[Tailwind CSS]
  B --> E[Local Storage]
  B --> F[Canvas API]
  
  subgraph "Frontend Layer"
    B
    C
    D
  end
  
  subgraph "Browser APIs"
    E
    F
  end
  
  subgraph "Deployment (Vercel)"
    G[Static Site Generation]
    H[Edge Functions]
  end
  
  B --> G
  B --> H
```

## 2. Technology Description

- Frontend: Next.js@14 + React@18 + TypeScript@5 + Tailwind CSS@3
- State Management: React useState + useContext
- Image Processing: html2canvas@1.4 + Canvas API
- Icons: Heroicons@2 + Lucide React@0.3
- Deployment: Vercel (Static Site Generation)
- Build Tool: Next.js built-in bundler

## 3. Route Definitions

| Route | Purpose |
|-------|---------|
| / | Main tweet generator page with all functionality |
| /api/export | API endpoint for server-side image generation (optional) |

## 4. API Definitions

### 4.1 Core API

Image Export (Optional Server-side)
```
POST /api/export
```

Request:
| Param Name | Param Type | isRequired | Description |
|------------|------------|------------|-------------|
| tweetData | TweetData | true | Complete tweet configuration object |
| format | string | false | Export format (png, jpg) - defaults to png |
| quality | number | false | Image quality 0.1-1.0 - defaults to 1.0 |

Response:
| Param Name | Param Type | Description |
|------------|------------|-------------|
| success | boolean | Export operation status |
| imageUrl | string | Base64 encoded image or download URL |
| error | string | Error message if failed |

Example Request:
```json
{
  "tweetData": {
    "profile": {
      "username": "elonmusk",
      "displayName": "Elon Musk",
      "avatar": "data:image/jpeg;base64,...",
      "verified": true,
      "followers": "150.2M"
    },
    "content": {
      "text": "Just launched another rocket! 🚀",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "engagement": {
      "likes": 125000,
      "retweets": 45000,
      "comments": 8500,
      "quotes": 2100
    }
  },
  "format": "png",
  "quality": 1.0
}
```

## 5. Server Architecture Diagram

```mermaid
graph TD
  A[Next.js App Router] --> B[Page Components]
  A --> C[API Routes]
  B --> D[Tweet Generator Component]
  B --> E[Profile Editor Component]
  B --> F[Content Editor Component]
  B --> G[Preview Component]
  C --> H[Export Handler]
  
  subgraph "Component Layer"
    D
    E
    F
    G
  end
  
  subgraph "API Layer"
    H
  end
  
  subgraph "State Management"
    I[Tweet Context]
    J[UI Context]
  end
  
  D --> I
  E --> I
  F --> I
  G --> I
  D --> J
```

## 6. Data Model

### 6.1 Data Model Definition

```mermaid
erDiagram
  TWEET_DATA {
    string id PK
    object profile
    object content
    object engagement
    object settings
    timestamp createdAt
    timestamp updatedAt
  }
  
  PROFILE {
    string username
    string displayName
    string avatar
    boolean verified
    string followers
    string handle
  }
  
  CONTENT {
    string text
    timestamp timestamp
    string timeFormat
    array media
  }
  
  ENGAGEMENT {
    number likes
    number retweets
    number comments
    number quotes
    number views
  }
  
  SETTINGS {
    string theme
    string language
    boolean showMetrics
    string exportFormat
  }
  
  TWEET_DATA ||--|| PROFILE : contains
  TWEET_DATA ||--|| CONTENT : contains
  TWEET_DATA ||--|| ENGAGEMENT : contains
  TWEET_DATA ||--|| SETTINGS : contains
```

### 6.2 Data Definition Language

TypeScript Interface Definitions:

```typescript
// Core Tweet Data Structure
interface TweetData {
  id: string;
  profile: ProfileData;
  content: ContentData;
  engagement: EngagementData;
  settings: SettingsData;
  createdAt: Date;
  updatedAt: Date;
}

// Profile Information
interface ProfileData {
  username: string;
  displayName: string;
  avatar: string; // Base64 or URL
  verified: boolean;
  followers: string; // Formatted string like "150.2M"
  handle: string; // @username format
}

// Tweet Content
interface ContentData {
  text: string;
  timestamp: Date;
  timeFormat: 'relative' | 'absolute';
  media?: MediaData[];
}

// Engagement Metrics
interface EngagementData {
  likes: number;
  retweets: number;
  comments: number;
  quotes: number;
  views?: number;
}

// Application Settings
interface SettingsData {
  theme: 'light' | 'dark';
  language: string;
  showMetrics: boolean;
  exportFormat: 'png' | 'jpg';
}

// Media Attachments (Future Enhancement)
interface MediaData {
  type: 'image' | 'video' | 'gif';
  url: string;
  alt?: string;
}

// Export Configuration
interface ExportConfig {
  format: 'png' | 'jpg';
  quality: number; // 0.1 to 1.0
  width?: number;
  height?: number;
  scale: number; // For high-DPI exports
}
```

Local Storage Schema:
```typescript
// Stored in localStorage for persistence
interface StoredTweetData {
  currentTweet: TweetData;
  recentTweets: TweetData[];
  userPreferences: SettingsData;
  lastExportConfig: ExportConfig;
}
```

Component Props Interfaces:
```typescript
interface TweetPreviewProps {
  tweetData: TweetData;
  className?: string;
  scale?: number;
}

interface ProfileEditorProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

interface ContentEditorProps {
  content: ContentData;
  onContentChange: (content: ContentData) => void;
  maxLength?: number;
}

interface EngagementEditorProps {
  engagement: EngagementData;
  onEngagementChange: (engagement: EngagementData) => void;
}
```
