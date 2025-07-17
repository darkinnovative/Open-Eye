import React, { useState, useRef, useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import AlertsPanel from './AlertsPanel';

const Header = ({ currentSection, systemStatus, onMenuClick, alerts }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const settingsRef = useRef(null);

  const unreadAlertCount = alerts ? alerts.filter(alert => !alert.read).length : 0;

  const getSectionTitle = () => {
    const sectionTitles = {
      live: 'Live View',
      playback: 'Playback',
      cameras: 'Camera Management',
      network: 'Network Settings',
      video: 'Video Settings',
      audio: 'Audio Settings',
      storage: 'Storage Settings',
      system: 'System Settings'
    };
    return sectionTitles[currentSection] || 'NVR System';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsSettingsOpen(false);
  };

  const handleAccountClick = () => {
    setShowAccountModal(true);
    setIsSettingsOpen(false);
  };

  const handleAlertsClick = () => {
    setShowAlertsPanel(true);
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    setIsSettingsOpen(false);
    // Add logout functionality here
    if (confirm('Are you sure you want to logout?')) {
      // Implement logout logic
      localStorage.removeItem('currentSection');
      window.location.reload();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-nvr-card border-b border-nvr-border z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-nvr-card-hover rounded-lg transition-colors lg:hidden"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="hamburger-line"></span>
                <span className="hamburger-line my-1"></span>
                <span className="hamburger-line"></span>
              </div>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-nvr-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-nvr-text">NVR System</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-nvr-text-secondary">
                <span className="font-medium">{getSectionTitle()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-nvr-success rounded-full"></div>
                <span className="text-sm text-nvr-text-secondary">
                  {systemStatus.activeCameras}/{systemStatus.totalCameras} Cameras
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus.networkStatus === 'Connected' ? 'bg-nvr-success' : 'bg-nvr-error'
                }`}></div>
                <span className="text-sm text-nvr-text-secondary">
                  {systemStatus.networkStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={handleAlertsClick}
                className="p-2 hover:bg-nvr-card-hover rounded-lg transition-colors relative"
              >
                <svg className="w-5 h-5 text-nvr-text" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {unreadAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-nvr-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                  </span>
                )}
              </button>
              
              <button className="p-2 hover:bg-nvr-card-hover rounded-lg transition-colors">
                <svg className="w-5 h-5 text-nvr-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h0z" />
                </svg>
              </button>
              
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={handleSettingsClick}
                  className="p-2 hover:bg-nvr-card-hover rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-nvr-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* Settings Dropdown Menu */}
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-nvr-card border border-nvr-border rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-nvr-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-nvr-primary rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-nvr-text">Admin User</div>
                            <div className="text-xs text-nvr-text-secondary">admin@nvr.local</div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-nvr-card-hover transition-colors"
                      >
                        <svg className="w-4 h-4 text-nvr-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-nvr-text">Profile</span>
                      </button>
                      
                      <button
                        onClick={handleAccountClick}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-nvr-card-hover transition-colors"
                      >
                        <svg className="w-4 h-4 text-nvr-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        <span className="text-sm text-nvr-text">Account Settings</span>
                      </button>
                      
                      <div className="border-t border-nvr-border my-2"></div>
                      
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-nvr-card-hover transition-colors text-nvr-error"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileSettings onClose={() => setShowProfileModal(false)} />
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountSettings onClose={() => setShowAccountModal(false)} />
      )}

      {/* Alerts Panel */}
      {showAlertsPanel && (
        <AlertsPanel 
          isOpen={showAlertsPanel} 
          onClose={() => setShowAlertsPanel(false)} 
        />
      )}
    </>
  );
};

export default Header;
