import React from 'react';

const Sidebar = ({ currentSection, onSectionChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'live', label: 'Live View', icon: '📹' },
    { id: 'playback', label: 'Playback', icon: '⏯️' },
    { id: 'cameras', label: 'Camera Management', icon: '📷' },
    { id: 'network', label: 'Network Settings', icon: '🌐' },
    { id: 'video', label: 'Video Settings', icon: '🎥' },
    { id: 'audio', label: 'Audio Settings', icon: '🔊' },
    { id: 'storage', label: 'Storage Settings', icon: '💾' },
    { id: 'system', label: 'System Settings', icon: '⚙️' }
  ];

  const handleItemClick = (sectionId) => {
    onSectionChange(sectionId);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-nvr-card border-r border-nvr-border
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        pt-16 lg:pt-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-nvr-text mb-4">Navigation</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left
                    transition-colors duration-200
                    ${currentSection === item.id 
                      ? 'bg-nvr-primary text-white' 
                      : 'text-nvr-text hover:bg-nvr-card-hover'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-nvr-border">
            <div className="text-sm text-nvr-text-secondary">
              <div className="flex items-center justify-between mb-2">
                <span>System Status</span>
                <div className="w-2 h-2 bg-nvr-success rounded-full"></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span>24h 15m</span>
                </div>
                <div className="flex justify-between">
                  <span>CPU:</span>
                  <span>45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span>62%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
