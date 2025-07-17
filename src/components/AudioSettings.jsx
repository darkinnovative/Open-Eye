import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AudioSettings = () => {
  const [settings, setSettings] = useState({
    audioEnabled: true,
    audioFormat: 'AAC',
    sampleRate: '48000',
    bitrate: '128',
    channels: '2',
    audioRecording: true,
    microphoneEnabled: false,
    microphoneGain: '50',
    speakerEnabled: false,
    speakerVolume: '75'
  });

  const audioFormatOptions = [
    { value: 'AAC', label: 'AAC' },
    { value: 'MP3', label: 'MP3' },
    { value: 'PCM', label: 'PCM' }
  ];

  const sampleRateOptions = [
    { value: '48000', label: '48 kHz' },
    { value: '44100', label: '44.1 kHz' },
    { value: '32000', label: '32 kHz' },
    { value: '16000', label: '16 kHz' }
  ];

  const bitrateOptions = [
    { value: '320', label: '320 kbps' },
    { value: '256', label: '256 kbps' },
    { value: '192', label: '192 kbps' },
    { value: '128', label: '128 kbps' },
    { value: '96', label: '96 kbps' },
    { value: '64', label: '64 kbps' }
  ];

  const channelOptions = [
    { value: '2', label: 'Stereo (2)' },
    { value: '1', label: 'Mono (1)' }
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
        text: 'Audio settings saved successfully',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save audio settings',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleTestAudio = async () => {
    try {
      // Simulate audio test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Swal.fire({
        icon: 'success',
        title: 'Audio Test',
        text: 'Audio system is working properly',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Audio Test',
        text: 'Audio system test failed',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-nvr-text">Audio Settings</h2>
        <button
          onClick={handleTestAudio}
          className="btn-secondary"
        >
          Test Audio
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Audio Recording</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="audioEnabled"
                name="audioEnabled"
                checked={settings.audioEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="audioEnabled" className="text-nvr-text">
                Enable Audio Recording
              </label>
            </div>
            
            {settings.audioEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-nvr-text mb-1">
                      Audio Format
                    </label>
                    <select
                      name="audioFormat"
                      value={settings.audioFormat}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {audioFormatOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nvr-text mb-1">
                      Sample Rate
                    </label>
                    <select
                      name="sampleRate"
                      value={settings.sampleRate}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {sampleRateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nvr-text mb-1">
                      Bitrate
                    </label>
                    <select
                      name="bitrate"
                      value={settings.bitrate}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {bitrateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nvr-text mb-1">
                      Channels
                    </label>
                    <select
                      name="channels"
                      value={settings.channels}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {channelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="audioRecording"
                    name="audioRecording"
                    checked={settings.audioRecording}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
                  />
                  <label htmlFor="audioRecording" className="text-nvr-text">
                    Record Audio with Video
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Microphone Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="microphoneEnabled"
                name="microphoneEnabled"
                checked={settings.microphoneEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="microphoneEnabled" className="text-nvr-text">
                Enable Microphone Input
              </label>
            </div>
            
            {settings.microphoneEnabled && (
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Microphone Gain: {settings.microphoneGain}%
                </label>
                <input
                  type="range"
                  name="microphoneGain"
                  value={settings.microphoneGain}
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

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Speaker Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="speakerEnabled"
                name="speakerEnabled"
                checked={settings.speakerEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="speakerEnabled" className="text-nvr-text">
                Enable Speaker Output
              </label>
            </div>
            
            {settings.speakerEnabled && (
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Speaker Volume: {settings.speakerVolume}%
                </label>
                <input
                  type="range"
                  name="speakerVolume"
                  value={settings.speakerVolume}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-nvr-form-bg rounded-lg appearance-none cursor-pointer slider"
                  min="0"
                  max="100"
                />
                <div className="flex justify-between text-sm text-nvr-text-secondary mt-1">
                  <span>Mute</span>
                  <span>Max</span>
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

export default AudioSettings;
