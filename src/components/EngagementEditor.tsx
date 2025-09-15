import React from 'react';
import { EngagementEditorProps } from '../types';
import { 
  HeartIcon, 
  ArrowPathRoundedSquareIcon, 
  ChatBubbleOvalLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const EngagementEditor: React.FC<EngagementEditorProps> = ({ 
  engagement, 
  onEngagementChange 
}) => {
  // Parse number input (handles K, M suffixes)
  const parseNumber = (value: string): number => {
    if (!value) return 0;
    
    const cleanValue = value.replace(/,/g, '').toLowerCase();
    const numericPart = parseFloat(cleanValue);
    
    if (isNaN(numericPart)) return 0;
    
    if (cleanValue.includes('k')) {
      return Math.floor(numericPart * 1000);
    }
    if (cleanValue.includes('m')) {
      return Math.floor(numericPart * 1000000);
    }
    
    return Math.floor(numericPart);
  };

  // Format number for display (1.2K, 15.3M, etc.)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const handleNumberChange = (field: keyof typeof engagement, value: string) => {
    const numericValue = parseNumber(value);
    onEngagementChange({ [field]: numericValue });
  };

  // Quick preset buttons
  const presets = [
    { label: 'Viral', likes: 125000, retweets: 45000, comments: 8500, quotes: 2100, views: 1200000 },
    { label: 'Popular', likes: 15000, retweets: 3200, comments: 850, quotes: 420, views: 180000 },
    { label: 'Moderate', likes: 1200, retweets: 180, comments: 45, quotes: 12, views: 15000 },
    { label: 'Low', likes: 25, retweets: 3, comments: 2, quotes: 0, views: 500 },
    { label: 'Zero', likes: 0, retweets: 0, comments: 0, quotes: 0, views: 0 }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Quick Presets:</h4>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onEngagementChange({
                likes: preset.likes,
                retweets: preset.retweets,
                comments: preset.comments,
                quotes: preset.quotes,
                views: preset.views
              })}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Likes */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <HeartIcon className="w-4 h-4 text-red-500" />
            <span>Likes</span>
          </label>
          <input
            type="text"
            value={formatNumber(engagement.likes)}
            onChange={(e) => handleNumberChange('likes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="0"
          />
          <p className="text-xs text-gray-500">Use K for thousands, M for millions</p>
        </div>

        {/* Retweets */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <ArrowPathRoundedSquareIcon className="w-4 h-4 text-green-500" />
            <span>Retweets</span>
          </label>
          <input
            type="text"
            value={formatNumber(engagement.retweets)}
            onChange={(e) => handleNumberChange('retweets', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="0"
          />
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <ChatBubbleOvalLeftIcon className="w-4 h-4 text-blue-500" />
            <span>Comments</span>
          </label>
          <input
            type="text"
            value={formatNumber(engagement.comments)}
            onChange={(e) => handleNumberChange('comments', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        {/* Quotes */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <ArrowPathRoundedSquareIcon className="w-4 h-4 text-purple-500" />
            <span>Quote Tweets</span>
          </label>
          <input
            type="text"
            value={formatNumber(engagement.quotes)}
            onChange={(e) => handleNumberChange('quotes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Views (Optional) */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <EyeIcon className="w-4 h-4 text-gray-500" />
          <span>Views (Optional)</span>
        </label>
        <input
          type="text"
          value={engagement.views ? formatNumber(engagement.views) : ''}
          onChange={(e) => handleNumberChange('views', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          placeholder="Leave empty to hide"
        />
        <p className="text-xs text-gray-500">Views are shown below the tweet if set</p>
      </div>

      {/* Current Values Preview */}
      <div className="bg-gray-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Values:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>Likes: {engagement.likes.toLocaleString()}</div>
          <div>Retweets: {engagement.retweets.toLocaleString()}</div>
          <div>Comments: {engagement.comments.toLocaleString()}</div>
          <div>Quotes: {engagement.quotes.toLocaleString()}</div>
          {engagement.views && engagement.views > 0 && (
            <div className="col-span-2">Views: {engagement.views.toLocaleString()}</div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-blue-700 mb-2">Tips:</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Use realistic ratios: likes &gt; retweets &gt; comments</li>
          <li>• Popular tweets often have 10-20% retweet rate</li>
          <li>• Comments are usually 5-10% of likes</li>
          <li>• Views are typically 10-50x the likes</li>
        </ul>
      </div>
    </div>
  );
};

export default EngagementEditor;