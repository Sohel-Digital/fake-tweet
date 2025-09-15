import React from 'react';
import { TweetPreviewProps } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  HeartIcon, 
  ArrowPathRoundedSquareIcon, 
  ChatBubbleOvalLeftIcon,
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const TweetPreview: React.FC<TweetPreviewProps> = ({ 
  tweetData, 
  className = '',
  scale = 1 
}) => {
  const { profile, content, engagement } = tweetData;

  // Format numbers like Twitter (1.2K, 15.3M, etc.)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  // Format timestamp
  const formatTimestamp = (): string => {
    if (content.timeFormat === 'relative') {
      return formatDistanceToNow(content.timestamp, { addSuffix: true });
    }
    return format(content.timestamp, 'h:mm a · MMM d, yyyy');
  };

  // Default avatar if none provided
  const avatarSrc = profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=1da1f2&color=fff&size=128`;

  return (
    <div 
      className={`tweet-preview bg-white border border-gray-200 rounded-xl p-4 max-w-lg mx-auto ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      id="tweet-preview-container"
    >
      {/* Tweet Header */}
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={avatarSrc}
            alt={`${profile.displayName} avatar`}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=1da1f2&color=fff&size=128`;
            }}
          />
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center space-x-1">
            <h3 className="font-bold text-gray-900 text-[15px] leading-5 truncate">
              {profile.displayName}
            </h3>
            {profile.verified && (
              <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
            <span className="text-gray-500 text-[15px] leading-5 truncate">
              {profile.handle}
            </span>
            <span className="text-gray-500 text-[15px] leading-5">·</span>
            <span className="text-gray-500 text-[15px] leading-5 whitespace-nowrap">
              {formatTimestamp()}
            </span>
          </div>

          {/* Tweet Text */}
          <div className="mt-1">
            <p className="text-gray-900 text-[15px] leading-5 whitespace-pre-wrap break-words">
              {content.text}
            </p>
          </div>

          {/* Engagement Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            {/* Reply */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <ChatBubbleOvalLeftIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
              </div>
              {engagement.comments > 0 && (
                <span className="text-sm text-gray-500 group-hover:text-blue-500">
                  {formatNumber(engagement.comments)}
                </span>
              )}
            </div>

            {/* Retweet */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <ArrowPathRoundedSquareIcon className="w-5 h-5 text-gray-500 group-hover:text-green-500" />
              </div>
              {engagement.retweets > 0 && (
                <span className="text-sm text-gray-500 group-hover:text-green-500">
                  {formatNumber(engagement.retweets)}
                </span>
              )}
            </div>

            {/* Like */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <HeartIcon className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
              </div>
              {engagement.likes > 0 && (
                <span className="text-sm text-gray-500 group-hover:text-red-500">
                  {formatNumber(engagement.likes)}
                </span>
              )}
            </div>

            {/* Share */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <ArrowUpTrayIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
              </div>
            </div>

            {/* More */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
              </div>
            </div>
          </div>

          {/* Views (if available) */}
          {engagement.views && engagement.views > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              {formatNumber(engagement.views)} views
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetPreview;