import React, { useState } from 'react';
import Swal from 'sweetalert2';

const VideoSettings = () => {
  const [settings, setSettings] = useState({
    resolution: '1920x1080',
    frameRate: '30',
    bitrate: '5000',
    encoding: 'H.264',
    quality: 'high',
    recordingEnabled: true,
    recordingDuration: '24',
    motionDetection: true,
    motionSensitivity: '70'
  });

  const resolutionOptions = [
    { value: '3840x2160', label: '4K (3840x2160)' },
    { value: '1920x1080', label: 'Full HD (1920x1080)' },
    { value: '1280x720', label: 'HD (1280x720)' },
    { value: '640x480', label: 'SD (640x480)' }
  ];

  const frameRateOptions = [
    { value: '60', label: '60 FPS' },
    { value: '30', label: '30 FPS' },
    { value: '25', label: '25 FPS' },
    { value: '15', label: '15 FPS' }
  ];

  const encodingOptions = [
    { value: 'H.264', label: 'H.264' },
    { value: 'H.265', label: 'H.265 (HEVC)' },
    { value: 'MJPEG', label: 'MJPEG' }
  ];

  const qualityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Video settings saved successfully',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save video settings',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-nvr-text">Video Settings</h2>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Video Quality</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Resolution
              </label>
              <select
                name="resolution"
                value={settings.resolution}
                onChange={handleInputChange}
                className="form-select"
              >
                {resolutionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Frame Rate
              </label>
              <select
                name="frameRate"
                value={settings.frameRate}
                onChange={handleInputChange}
                className="form-select"
              >
                {frameRateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Bitrate (kbps)
              </label>
              <input
                type="number"
                name="bitrate"
                value={settings.bitrate}
                onChange={handleInputChange}
                className="form-input"
                min="500"
                max="50000"
                step="500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Encoding
              </label>
              <select
                name="encoding"
                value={settings.encoding}
                onChange={handleInputChange}
                className="form-select"
              >
                {encodingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Quality
              </label>
              <select
                name="quality"
                value={settings.quality}
                onChange={handleInputChange}
                className="form-select"
              >
                {qualityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Recording Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="recordingEnabled"
                name="recordingEnabled"
                checked={settings.recordingEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="recordingEnabled" className="text-nvr-text">
                Enable Continuous Recording
              </label>
            </div>
            
            {settings.recordingEnabled && (
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Recording Duration (hours)
                </label>
                <input
                  type="number"
                  name="recordingDuration"
                  value={settings.recordingDuration}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  max="720"
                />
                <p className="text-sm text-nvr-text-secondary mt-1">
                  Maximum duration for each recording segment
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Motion Detection</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="motionDetection"
                name="motionDetection"
                checked={settings.motionDetection}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="motionDetection" className="text-nvr-text">
                Enable Motion Detection
              </label>
            </div>
            
            {settings.motionDetection && (
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Motion Sensitivity: {settings.motionSensitivity}%
                </label>
                <input
                  type="range"
                  name="motionSensitivity"
                  value={settings.motionSensitivity}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-nvr-form-bg rounded-lg appearance-none cursor-pointer slider"
                  min="0"
                  max="100"
                />
                <div className="flex justify-between text-sm text-nvr-text-secondary mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" className="btn-secondary">
            Reset to Default
          </button>
          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoSettings;
