import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { ExportButtonProps, ExportConfig } from '../types';
import { ArrowDownTrayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useUI } from '../contexts/TweetContext';

const ExportButton: React.FC<ExportButtonProps> = ({ 
  tweetData,
  exportConfig: initialConfig,
  onExportConfigChange
}) => {
  const { isExporting, setIsExporting } = useUI();
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<ExportConfig>(initialConfig || {
    format: 'png',
    quality: 0.9,
    scale: 2
  });

  const updateConfig = (updates: Partial<ExportConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onExportConfigChange?.(newConfig);
  };

  const exportTweet = async () => {
    const element = document.getElementById('tweet-preview-container');
    if (!element) {
      alert('Tweet preview not found. Please try again.');
      return;
    }

    setIsExporting(true);

    try {
      // Configure html2canvas options
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: config.scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in the cloned document
          const clonedElement = clonedDoc.getElementById('tweet-preview-container');
          if (clonedElement) {
            clonedElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
          }
        }
      });

      // Create download link
      const link = document.createElement('a');
      
      if (config.format === 'png') {
        link.download = `fake-tweet-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
      } else {
        link.download = `fake-tweet-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', config.quality);
      }

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      successDiv.textContent = 'Tweet exported successfully!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export tweet. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Export Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={exportTweet}
          disabled={isExporting}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
            isExporting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Export Settings"
        >
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Export Settings Panel */}
      {showSettings && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Export Settings</h3>
          
          {/* Format Selection */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={config.format === 'png'}
                  onChange={(e) => updateConfig({ format: e.target.value as 'png' | 'jpg' })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">PNG (Lossless)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="jpg"
                  checked={config.format === 'jpg'}
                  onChange={(e) => updateConfig({ format: e.target.value as 'png' | 'jpg' })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">JPG (Smaller)</span>
              </label>
            </div>
          </div>

          {/* Quality (for JPG) */}
          {config.format === 'jpg' && (
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Quality: {Math.round(config.quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={config.quality}
                onChange={(e) => updateConfig({ quality: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Lower size</span>
                <span>Higher quality</span>
              </div>
            </div>
          )}

          {/* Scale/Resolution */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Resolution: {config.scale}x
            </label>
            <select
              value={config.scale}
              onChange={(e) => updateConfig({ scale: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1x (Standard)</option>
              <option value={2}>2x (High DPI)</option>
              <option value={3}>3x (Ultra High)</option>
            </select>
            <p className="text-xs text-gray-500">
              Higher resolution = larger file size but better quality
            </p>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-600">
            <div className="font-medium mb-1">Export Preview:</div>
            <div>Format: {config.format.toUpperCase()}</div>
            {config.format === 'jpg' && (
              <div>Quality: {Math.round(config.quality * 100)}%</div>
            )}
            <div>Resolution: {config.scale}x</div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowSettings(false)}
            className="w-full mt-3 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close Settings
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Exporting your tweet...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;