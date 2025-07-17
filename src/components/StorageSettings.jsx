import React, { useState } from 'react';
import Swal from 'sweetalert2';

const StorageSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    storageLocation: '/var/nvr/recordings',
    maxStorageSize: '1000',
    autoDelete: true,
    retentionDays: '30',
    compressionEnabled: true,
    compressionLevel: '6',
    backupEnabled: false,
    backupLocation: '/backup/nvr',
    backupSchedule: 'daily'
  });

  const [storageStats, setStorageStats] = useState({
    totalSpace: 2000,
    usedSpace: 650,
    freeSpace: 1350,
    recordings: 1250,
    backups: 180
  });

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
        text: 'Storage settings saved successfully',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save storage settings',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleCleanupOldRecordings = async () => {
    const result = await Swal.fire({
      title: 'Clean up old recordings?',
      text: 'This will delete recordings older than the retention period.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clean up!',
      background: '#2a2a2a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        // Simulate cleanup
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        Swal.fire({
          icon: 'success',
          title: 'Cleanup Complete',
          text: 'Old recordings have been cleaned up successfully',
          background: '#2a2a2a',
          color: '#fff'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Cleanup Failed',
          text: 'Failed to clean up old recordings',
          background: '#2a2a2a',
          color: '#fff'
        });
      }
    }
  };

  const getStorageUsagePercentage = () => {
    return ((storageStats.usedSpace / storageStats.totalSpace) * 100).toFixed(1);
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Storage Location</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-nvr-text mb-1">
              Recording Storage Path
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="storageLocation"
                value={settings.storageLocation}
                onChange={handleInputChange}
                className="form-input flex-1"
                placeholder="/var/nvr/recordings"
              />
              <button type="button" className="btn-secondary">
                Browse
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-nvr-text mb-1">
              Maximum Storage Size (GB)
            </label>
            <input
              type="number"
              name="maxStorageSize"
              value={settings.maxStorageSize}
              onChange={handleInputChange}
              className="form-input"
              min="100"
              max="10000"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Auto-Delete Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoDelete"
              name="autoDelete"
              checked={settings.autoDelete}
              onChange={handleInputChange}
              className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
            />
            <label htmlFor="autoDelete" className="text-nvr-text">
              Automatically delete old recordings
            </label>
          </div>
          
          {settings.autoDelete && (
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Retention Period (days)
              </label>
              <input
                type="number"
                name="retentionDays"
                value={settings.retentionDays}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                max="365"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Compression Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="compressionEnabled"
              name="compressionEnabled"
              checked={settings.compressionEnabled}
              onChange={handleInputChange}
              className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
            />
            <label htmlFor="compressionEnabled" className="text-nvr-text">
              Enable compression for stored recordings
            </label>
          </div>
          
          {settings.compressionEnabled && (
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Compression Level: {settings.compressionLevel}
              </label>
              <input
                type="range"
                name="compressionLevel"
                value={settings.compressionLevel}
                onChange={handleInputChange}
                className="w-full h-2 bg-nvr-form-bg rounded-lg appearance-none cursor-pointer slider"
                min="1"
                max="9"
              />
              <div className="flex justify-between text-sm text-nvr-text-secondary mt-1">
                <span>Fast</span>
                <span>Best</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Backup Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="backupEnabled"
              name="backupEnabled"
              checked={settings.backupEnabled}
              onChange={handleInputChange}
              className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
            />
            <label htmlFor="backupEnabled" className="text-nvr-text">
              Enable automatic backups
            </label>
          </div>
          
          {settings.backupEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Backup Location
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="backupLocation"
                    value={settings.backupLocation}
                    onChange={handleInputChange}
                    className="form-input flex-1"
                    placeholder="/backup/nvr"
                  />
                  <button type="button" className="btn-secondary">
                    Browse
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Backup Schedule
                </label>
                <select
                  name="backupSchedule"
                  value={settings.backupSchedule}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Backup Actions</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex space-x-3">
            <button type="button" className="btn-primary">
              Start Backup Now
            </button>
            <button type="button" className="btn-secondary">
              Restore from Backup
            </button>
          </div>
          
          <div className="text-sm text-nvr-text-secondary">
            <p>Last backup: 2 hours ago</p>
            <p>Next scheduled backup: In 6 hours</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Storage Usage</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-nvr-text">Total Storage</span>
            <span className="text-nvr-text font-semibold">{storageStats.totalSpace} GB</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-nvr-text-secondary">Used</span>
              <span className="text-nvr-text">{storageStats.usedSpace} GB ({getStorageUsagePercentage()}%)</span>
            </div>
            <div className="w-full bg-nvr-form-bg rounded-full h-2">
              <div 
                className="bg-nvr-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStorageUsagePercentage()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-nvr-text">{storageStats.recordings} GB</div>
              <div className="text-sm text-nvr-text-secondary">Recordings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-nvr-text">{storageStats.backups} GB</div>
              <div className="text-sm text-nvr-text-secondary">Backups</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-nvr-text">Storage Maintenance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-nvr-text font-medium">Clean up old recordings</h4>
              <p className="text-sm text-nvr-text-secondary">Remove recordings older than retention period</p>
            </div>
            <button
              type="button"
              onClick={handleCleanupOldRecordings}
              className="btn-warning"
            >
              Clean Up
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-nvr-text font-medium">Optimize storage</h4>
              <p className="text-sm text-nvr-text-secondary">Defragment and optimize storage performance</p>
            </div>
            <button type="button" className="btn-secondary">
              Optimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', content: renderGeneralTab },
    { id: 'backup', label: 'Backup', content: renderBackupTab },
    { id: 'monitoring', label: 'Monitoring', content: renderMonitoringTab }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-nvr-text">Storage Settings</h2>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 bg-nvr-card p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-nvr-primary text-white'
                  : 'text-nvr-text-secondary hover:text-nvr-text hover:bg-nvr-card-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSaveSettings}>
        {tabs.find(tab => tab.id === activeTab)?.content()}
        
        <div className="flex justify-end space-x-3 mt-6">
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

export default StorageSettings;
