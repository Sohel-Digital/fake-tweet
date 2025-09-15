import React from 'react';
import { TimestampEditorProps } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

const TimestampEditor: React.FC<TimestampEditorProps> = ({ 
  content, 
  onContentChange 
}) => {
  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Format time for input (HH:mm)
  const formatTimeForInput = (date: Date): string => {
    return format(date, 'HH:mm');
  };

  // Handle date change
  const handleDateChange = (dateString: string) => {
    const currentTime = content.timestamp;
    const [year, month, day] = dateString.split('-').map(Number);
    const newDate = new Date(currentTime);
    newDate.setFullYear(year, month - 1, day);
    onContentChange({ timestamp: newDate });
  };

  // Handle time change
  const handleTimeChange = (timeString: string) => {
    const currentDate = content.timestamp;
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(currentDate);
    newDate.setHours(hours, minutes);
    onContentChange({ timestamp: newDate });
  };

  // Quick time presets
  const timePresets = [
    { label: 'Now', getValue: () => new Date() },
    { label: '1 hour ago', getValue: () => new Date(Date.now() - 60 * 60 * 1000) },
    { label: '3 hours ago', getValue: () => new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { label: '1 day ago', getValue: () => new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { label: '1 week ago', getValue: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { label: '1 month ago', getValue: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  ];

  return (
    <div className="space-y-4">
      {/* Time Format Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Display Format</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="timeFormat"
              value="relative"
              checked={content.timeFormat === 'relative'}
              onChange={(e) => onContentChange({ timeFormat: e.target.value as 'relative' | 'absolute' })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Relative (e.g., "2 hours ago")</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="timeFormat"
              value="absolute"
              checked={content.timeFormat === 'absolute'}
              onChange={(e) => onContentChange({ timeFormat: e.target.value as 'relative' | 'absolute' })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Absolute (e.g., "2:30 PM · Dec 15, 2023")</span>
          </label>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Quick Presets:</h4>
        <div className="flex flex-wrap gap-2">
          {timePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => onContentChange({ timestamp: preset.getValue() })}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <CalendarIcon className="w-4 h-4" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={formatDateForInput(content.timestamp)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <ClockIcon className="w-4 h-4" />
            <span>Time</span>
          </label>
          <input
            type="time"
            value={formatTimeForInput(content.timestamp)}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div>
            <span className="font-medium">Relative:</span> {formatDistanceToNow(content.timestamp, { addSuffix: true })}
          </div>
          <div>
            <span className="font-medium">Absolute:</span> {format(content.timestamp, 'h:mm a · MMM d, yyyy')}
          </div>
          <div>
            <span className="font-medium">Current selection:</span> 
            <span className="ml-1 font-medium text-blue-600">
              {content.timeFormat === 'relative' 
                ? formatDistanceToNow(content.timestamp, { addSuffix: true })
                : format(content.timestamp, 'h:mm a · MMM d, yyyy')
              }
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-md p-3">
        <h4 className="text-sm font-medium text-blue-700 mb-2">Tips:</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Relative time updates automatically ("2 hours ago" becomes "3 hours ago")</li>
          <li>• Absolute time shows exact date and time like real Twitter</li>
          <li>• Use recent times for more realistic-looking tweets</li>
          <li>• Consider your audience's timezone when setting times</li>
        </ul>
      </div>

      {/* Current Timestamp Info */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <div>Full timestamp: {content.timestamp.toLocaleString()}</div>
        <div>ISO format: {content.timestamp.toISOString()}</div>
      </div>
    </div>
  );
};

export default TimestampEditor;