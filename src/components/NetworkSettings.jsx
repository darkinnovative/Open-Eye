import React, { useState } from 'react';
import Swal from 'sweetalert2';

const NetworkSettings = () => {
  const [settings, setSettings] = useState({
    dhcp: true,
    ipAddress: '192.168.1.100',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    primaryDns: '8.8.8.8',
    secondaryDns: '8.8.4.4',
    port: '8080',
    httpsEnabled: false,
    httpsPort: '8443'
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
        text: 'Network settings saved successfully',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save network settings',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleTestConnection = async () => {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Swal.fire({
        icon: 'success',
        title: 'Connection Test',
        text: 'Network connection is working properly',
        background: '#2a2a2a',
        color: '#fff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Test',
        text: 'Network connection failed',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-nvr-text">Network Settings</h2>
        <button
          onClick={handleTestConnection}
          className="btn-secondary"
        >
          Test Connection
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">IP Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="dhcp"
                name="dhcp"
                checked={settings.dhcp}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="dhcp" className="text-nvr-text">
                Enable DHCP (Automatic IP Configuration)
              </label>
            </div>
            
            {!settings.dhcp && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nvr-text mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    name="ipAddress"
                    value={settings.ipAddress}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="192.168.1.100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-nvr-text mb-1">
                    Subnet Mask
                  </label>
                  <input
                    type="text"
                    name="subnetMask"
                    value={settings.subnetMask}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="255.255.255.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-nvr-text mb-1">
                    Gateway
                  </label>
                  <input
                    type="text"
                    name="gateway"
                    value={settings.gateway}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="192.168.1.1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">DNS Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Primary DNS
              </label>
              <input
                type="text"
                name="primaryDns"
                value={settings.primaryDns}
                onChange={handleInputChange}
                className="form-input"
                placeholder="8.8.8.8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                Secondary DNS
              </label>
              <input
                type="text"
                name="secondaryDns"
                value={settings.secondaryDns}
                onChange={handleInputChange}
                className="form-input"
                placeholder="8.8.4.4"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">Port Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-nvr-text mb-1">
                HTTP Port
              </label>
              <input
                type="number"
                name="port"
                value={settings.port}
                onChange={handleInputChange}
                className="form-input"
                placeholder="8080"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="httpsEnabled"
                name="httpsEnabled"
                checked={settings.httpsEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-nvr-primary bg-nvr-form-bg border-nvr-border rounded focus:ring-nvr-primary"
              />
              <label htmlFor="httpsEnabled" className="text-nvr-text">
                Enable HTTPS
              </label>
            </div>
            
            {settings.httpsEnabled && (
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  HTTPS Port
                </label>
                <input
                  type="number"
                  name="httpsPort"
                  value={settings.httpsPort}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="8443"
                />
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

export default NetworkSettings;
