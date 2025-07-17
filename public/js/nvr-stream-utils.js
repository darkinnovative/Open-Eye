// HLS.js loader for live video streaming
// This script loads HLS.js from CDN and makes it available globally

(function() {
  // Check if HLS is already loaded
  if (window.Hls) {
    return;
  }

  // Create script tag for HLS.js
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
  script.async = true;
  
  script.onload = function() {
    console.log('HLS.js loaded successfully');
    
    // Dispatch event to notify components that HLS is ready
    window.dispatchEvent(new CustomEvent('hlsLoaded'));
  };
  
  script.onerror = function() {
    console.error('Failed to load HLS.js');
  };
  
  // Add to document head
  document.head.appendChild(script);
})();

// WebRTC utilities
window.NVRWebRTC = {
  createPeerConnection: function(config) {
    const defaultConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    return new RTCPeerConnection({ ...defaultConfig, ...config });
  },
  
  createOffer: async function(pc) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  },
  
  createAnswer: async function(pc, offer) {
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }
};

// MJPEG utilities
window.NVRMJPEGStreamer = {
  createStream: function(url, element, options = {}) {
    const {
      fps = 10,
      retryInterval = 5000,
      maxRetries = 10
    } = options;
    
    let retryCount = 0;
    let intervalId;
    
    const updateFrame = () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob and set as video source
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            element.src = url;
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }
        });
        
        retryCount = 0; // Reset retry count on success
      };
      
      img.onerror = () => {
        retryCount++;
        if (retryCount < maxRetries) {
          console.warn(`MJPEG stream error, retrying... (${retryCount}/${maxRetries})`);
          setTimeout(updateFrame, retryInterval);
        } else {
          console.error('MJPEG stream failed after maximum retries');
          clearInterval(intervalId);
        }
      };
      
      img.src = url + '?t=' + Date.now();
    };
    
    // Start the stream
    updateFrame();
    intervalId = setInterval(updateFrame, 1000 / fps);
    
    return {
      stop: () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };
  }
};

// Stream health monitoring
window.NVRStreamMonitor = {
  monitors: new Map(),
  
  startMonitoring: function(streamId, checkFunction, interval = 5000) {
    this.stopMonitoring(streamId);
    
    const monitor = {
      id: streamId,
      checkFunction,
      interval: setInterval(checkFunction, interval),
      lastCheck: Date.now(),
      status: 'unknown'
    };
    
    this.monitors.set(streamId, monitor);
    return monitor;
  },
  
  stopMonitoring: function(streamId) {
    const monitor = this.monitors.get(streamId);
    if (monitor) {
      clearInterval(monitor.interval);
      this.monitors.delete(streamId);
    }
  },
  
  getStatus: function(streamId) {
    const monitor = this.monitors.get(streamId);
    return monitor ? monitor.status : 'unknown';
  },
  
  updateStatus: function(streamId, status) {
    const monitor = this.monitors.get(streamId);
    if (monitor) {
      monitor.status = status;
      monitor.lastCheck = Date.now();
    }
  }
};

console.log('NVR Live Video utilities loaded');
