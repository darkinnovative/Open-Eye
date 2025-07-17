import React, { useState } from 'react';
import Swal from 'sweetalert2';

const SystemSettings = ({ systemStatus }) => {
  const [settings, setSettings] = useState({
    systemName: 'NVR System',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    autoStartup: true,
    logLevel: 'INFO',
    maxLogSize: '100',
    autoUpdate: false,
    updateChannel: 'stable'
  });

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'GMT' },
    { value: 'Europe/Paris', label: 'CET' },
    { value: 'Asia/Tokyo', label: 'JST' },
    { value: 'Asia/Shanghai', label: 'CST' }
  ];

  const dateFormats = [
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' }
  ];

  const logLevels = [
    { value: 'DEBUG', label: 'Debug' },
    { value: 'INFO', label: 'Info' },
    { value: 'WARNING', label: 'Warning' },
    { value: 'ERROR', label: 'Error' }
  ];

  const updateChannels = [
    { value: 'stable', label: 'Stable' },
    { value: 'beta', label: 'Beta' },
    { value: 'dev', label: 'Development' }
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
        text: 'System settings saved successfully',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save system settings',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleRestartSystem = async () => {
    const result = await Swal.fire({
      title: 'Restart System?',
      text: 'This will restart the NVR system. All active recordings will be stopped.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restart!',
      background: '#2a2a2a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        // Simulate restart
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        Swal.fire({
          icon: 'success',
          title: 'System Restarted',
          text: 'NVR system has been restarted successfully',
          background: '#2a2a2a',
          color: '#fff'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Restart Failed',
          text: 'Failed to restart the system',
          background: '#2a2a2a',
          color: '#fff'
        });
      }
    }
  };

  const handleExportLogs = async () => {
    try {
      // Simulate log export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Swal.fire({
        icon: 'success',
        title: 'Export Complete',
        text: 'System logs have been exported successfully',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export system logs',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleCheckUpdates = async () => {
    try {
      // Simulate update check
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const hasUpdates = Math.random() > 0.5;
      
      if (hasUpdates) {
        Swal.fire({
          icon: 'info',
          title: 'Updates Available',
          text: 'Version 2.1.0 is available. Would you like to update?',
          showCancelButton: true,
          confirmButtonText: 'Update Now',
          background: '#2a2a2a',
          color: '#fff'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Up to Date',
          text: 'Your system is running the latest version',
          background: '#2a2a2a',
          color: '#fff'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Check Failed',
        text: 'Failed to check for updates',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-nvr-text">System Settings</h2>
        <button
          onClick={handleRestartSystem}
          className="btn-warning"
        >
          Restart System
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-nvr-text">{systemStatus.totalCameras}</div>
            <div className="text-sm text-nvr-text-secondary">Total Cameras</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-nvr-success">{systemStatus.activeCameras}</div>
            <div className="text-sm text-nvr-text-secondary">Active Cameras</div>
          </div>
        </div>
        
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-nvr-text">{systemStatus.storageUsed}%</div>
            <div className="text-sm text-nvr-text-secondary">Storage Used</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">General Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                System Name
              </label>
              <input
                type="text"
                name="systemName"
                value={settings.systemName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="NVR System"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
                className="form-select"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Date Format
              </label>
              <select
                name="dateFormat"
                value={settings.dateFormat}
                onChange={handleInputChange}
                className="form-select"
              >
                {dateFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Time Format
              </label>
              <select
                name="timeFormat"
                value={settings.timeFormat}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="24h">24 Hour</option>
                <option value="12h">12 Hour (AM/PM)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoStartup"
                name="autoStartup"
                checked={settings.autoStartup}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="autoStartup" className="text-nvr-text">
                Start system automatically on boot
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Logging Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Log Level
              </label>
              <select
                name="logLevel"
                value={settings.logLevel}
                onChange={handleInputChange}
                className="form-select"
              >
                {logLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Max Log File Size (MB)
              </label>
              <input
                type="number"
                name="maxLogSize"
                value={settings.maxLogSize}
                onChange={handleInputChange}
                className="form-input"
                min="10"
                max="1000"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={handleExportLogs}
              className="btn-secondary"
            >
              Export Logs
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Update Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoUpdate"
                name="autoUpdate"
                checked={settings.autoUpdate}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="autoUpdate" className="text-nvr-text">
                Enable automatic updates
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Update Channel
              </label>
              <select
                name="updateChannel"
                value={settings.updateChannel}
                onChange={handleInputChange}
                className="form-select"
              >
                {updateChannels.map(channel => (
                  <option key={channel.value} value={channel.value}>
                    {channel.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleCheckUpdates}
                className="btn-secondary"
              >
                Check for Updates
              </button>
            </div>
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

export default SystemSettings;
