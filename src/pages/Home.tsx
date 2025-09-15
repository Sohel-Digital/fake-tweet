import React from 'react';
import { UIProvider } from '../contexts/TweetContext';
import TweetPreview from '../components/TweetPreview';
import ProfileEditor from '../components/ProfileEditor';
import ContentEditor from '../components/ContentEditor';
import EngagementEditor from '../components/EngagementEditor';
import TimestampEditor from '../components/TimestampEditor';
import ExportButton from '../components/ExportButton';
import { useTweetStore } from '../contexts/TweetContext';

const Home: React.FC = () => {
  const tweetData = useTweetStore((state) => state.tweetData);
  const updateProfile = useTweetStore((state) => state.updateProfile);
  const updateContent = useTweetStore((state) => state.updateContent);
  const updateEngagement = useTweetStore((state) => state.updateEngagement);
  const resetTweet = useTweetStore((state) => state.resetTweet);

  return (
    <UIProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Fake Tweet Maker</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetTweet}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <ExportButton tweetData={tweetData} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
                <ProfileEditor 
                  profile={tweetData.profile} 
                  onProfileChange={updateProfile} 
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tweet Content</h2>
                <ContentEditor 
                  content={tweetData.content} 
                  onContentChange={updateContent} 
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamp</h2>
                <TimestampEditor 
                  content={tweetData.content} 
                  onContentChange={updateContent} 
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h2>
                <EngagementEditor 
                  engagement={tweetData.engagement} 
                  onEngagementChange={updateEngagement} 
                />
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="flex justify-center">
                  <TweetPreview tweetData={tweetData} />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>Create realistic-looking fake tweets for educational and entertainment purposes.</p>
              <p className="mt-1">Built with React, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </footer>
      </div>
    </UIProvider>
  );
};

export default Home;