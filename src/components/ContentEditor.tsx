import React from 'react';
import { ContentEditorProps } from '../types';

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content, 
  onContentChange, 
  maxLength = 280 
}) => {
  const handleTextChange = (text: string) => {
    // Allow text up to maxLength + some buffer for editing
    if (text.length <= maxLength + 10) {
      onContentChange({ text });
    }
  };

  const remainingChars = maxLength - content.text.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars >= 0;

  // Calculate progress for the circular indicator
  const progress = Math.min((content.text.length / maxLength) * 100, 100);
  const circumference = 2 * Math.PI * 10; // radius = 10
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get color based on character count
  const getCounterColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getProgressColor = () => {
    if (isOverLimit) return '#ef4444'; // red-500
    if (isNearLimit) return '#eab308'; // yellow-500
    return '#3b82f6'; // blue-500
  };

  return (
    <div className="space-y-3">
      {/* Text Area */}
      <div className="relative">
        <textarea
          value={content.text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="What's happening?"
          className={`w-full px-3 py-3 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent ${
            isOverLimit 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          rows={4}
          style={{ fontSize: '16px' }} // Prevent zoom on iOS
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          {/* Circular Progress Indicator */}
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
              {/* Background circle */}
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#e5e7eb"
                strokeWidth="2"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={getProgressColor()}
                strokeWidth="2"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 ease-out"
              />
            </svg>
            {/* Show number when near or over limit */}
            {(isNearLimit || isOverLimit) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-medium ${getCounterColor()}`}>
                  {remainingChars}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Character Count Display */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className={getCounterColor()}>
            {content.text.length} / {maxLength}
          </span>
          {isOverLimit && (
            <span className="text-red-500 font-medium">
              {Math.abs(remainingChars)} characters over limit
            </span>
          )}
        </div>
        
        {/* Tweet Button Preview */}
        <button
          disabled={content.text.length === 0 || isOverLimit}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            content.text.length === 0 || isOverLimit
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Tweet
        </button>
      </div>

      {/* Helpful Tips */}
      <div className="bg-gray-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Use line breaks to make your tweet more readable</li>
          <li>• Add emojis to make your tweet more engaging 🚀</li>
          <li>• Mention usernames with @ and hashtags with #</li>
          <li>• URLs will be automatically shortened by Twitter</li>
        </ul>
      </div>

      {/* Quick Templates */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Quick Templates:</h4>
        <div className="flex flex-wrap gap-2">
          {[
            "Just shipped a new feature! 🚀",
            "Excited to announce...",
            "Hot take: ",
            "PSA: ",
            "Thread 🧵 (1/n)"
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => handleTextChange(template)}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;