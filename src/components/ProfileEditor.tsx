import React, { useRef } from 'react';
import { ProfileEditorProps } from '../types';
import { CheckBadgeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid';

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onProfileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onProfileChange({ avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (username: string) => {
    // Remove @ symbol and spaces, convert to lowercase
    const cleanUsername = username.replace(/[@\s]/g, '').toLowerCase();
    onProfileChange({ 
      username: cleanUsername,
      handle: `@${cleanUsername}`
    });
  };

  const currentAvatar = profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=1da1f2&color=fff&size=128`;

  return (
    <div className="space-y-4">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={currentAvatar}
            alt="Profile avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=1da1f2&color=fff&size=128`;
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <PhotoIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload Avatar
          </button>
          <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={profile.displayName}
          onChange={(e) => onProfileChange({ displayName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your display name"
          maxLength={50}
        />
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
          <input
            id="username"
            type="text"
            value={profile.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="username"
            maxLength={15}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only</p>
      </div>

      {/* Followers Count */}
      <div>
        <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-1">
          Followers Count
        </label>
        <input
          id="followers"
          type="text"
          value={profile.followers}
          onChange={(e) => onProfileChange({ followers: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="150.2M"
        />
        <p className="text-xs text-gray-500 mt-1">Use format like: 1.2K, 15.3M, 500</p>
      </div>

      {/* Verification Badge */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Verification Badge</label>
          <p className="text-xs text-gray-500">Show blue checkmark next to name</p>
        </div>
        <button
          onClick={() => onProfileChange({ verified: !profile.verified })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            profile.verified ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              profile.verified ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Preview Badge */}
      {profile.verified && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-md">
          <CheckBadgeIconSolid className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-blue-700">Verification badge will appear next to your name</span>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;