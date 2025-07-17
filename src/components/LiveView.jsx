import React, { useState, useEffect, useRef } from 'react';

const LiveView = ({ cameras }) => {
  const [gridSize, setGridSize] = useState(4);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullViewCamera, setFullViewCamera] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMiniNav, setShowMiniNav] = useState(false);
  const [videoStreams, setVideoStreams] = useState({});
  const [streamType, setStreamType] = useState('hls'); // 'hls', 'webrtc', 'mjpeg'
  const [isRecording, setIsRecording] = useState({});
  const [streamHealth, setStreamHealth] = useState({});
  const videoRefs = useRef({});
  const hlsInstances = useRef({});
  const mediaRecorders = useRef({});
  const webSocketRefs = useRef({});
  const [wsConnected, setWsConnected] = useState(false);
  const [backendUrl, setBackendUrl] = useState('ws://localhost:8000');

  const gridSizes = [
    { value: 1, label: '1x1' },
    { value: 4, label: '2x2' },
    { value: 9, label: '3x3' },
    { value: 16, label: '4x4' }
  ];

  const streamTypes = [
    { value: 'hls', label: 'HLS' },
    { value: 'webrtc', label: 'WebRTC' },
    { value: 'mjpeg', label: 'MJPEG' }
  ];

  // Initialize video streams
  useEffect(() => {
    if (cameras) {
      cameras.forEach(camera => {
        if (camera.status === 'online') {
          initializeStream(camera);
        }
      });
    }
    
    // Initialize WebSocket connection to FastAPI backend
    initializeWebSocketConnection();
    
    return () => {
      // Cleanup all streams and WebSocket connections
      Object.values(hlsInstances.current).forEach(hls => {
        if (hls) hls.destroy();
      });
      Object.values(mediaRecorders.current).forEach(recorder => {
        if (recorder && recorder.state !== 'inactive') {
          recorder.stop();
        }
      });
      Object.values(webSocketRefs.current).forEach(ws => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, [cameras, streamType]);

  // Initialize WebSocket connection to FastAPI backend
  const initializeWebSocketConnection = () => {
    const ws = new WebSocket(`${backendUrl}/ws/live`);
    
    ws.onopen = () => {
      console.log('Connected to FastAPI WebSocket');
      setWsConnected(true);
      
      // Request camera list and stream info
      ws.send(JSON.stringify({
        type: 'get_cameras',
        data: {}
      }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from FastAPI WebSocket');
      setWsConnected(false);
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        initializeWebSocketConnection();
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };
    
    webSocketRefs.current.main = ws;
  };

  // Handle WebSocket messages from FastAPI backend
  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'camera_list':
        // Update camera list from backend
        console.log('Received camera list:', message.data);
        break;
        
      case 'stream_data':
        // Handle streaming data
        handleStreamData(message.data);
        break;
        
      case 'camera_status':
        // Update camera status
        updateCameraStatus(message.data);
        break;
        
      case 'stream_health':
        // Update stream health
        setStreamHealth(prev => ({
          ...prev,
          [message.data.camera_id]: message.data.health
        }));
        break;
        
      case 'recording_status':
        // Update recording status
        setIsRecording(prev => ({
          ...prev,
          [message.data.camera_id]: message.data.is_recording
        }));
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  // Handle streaming data from WebSocket
  const handleStreamData = (data) => {
    const { camera_id, stream_type, data: streamData } = data;
    const videoElement = videoRefs.current[camera_id];
    
    if (!videoElement) return;
    
    switch (stream_type) {
      case 'webrtc':
        // Handle WebRTC signaling data
        handleWebRTCSignaling(camera_id, streamData);
        break;
        
      case 'mjpeg':
        // Handle MJPEG frame data
        handleMJPEGFrame(camera_id, streamData);
        break;
        
      case 'hls':
        // Handle HLS playlist updates
        handleHLSUpdate(camera_id, streamData);
        break;
    }
  };

  // Handle WebRTC signaling through WebSocket
  const handleWebRTCSignaling = async (cameraId, signalingData) => {
    const pc = hlsInstances.current[cameraId];
    if (!pc) return;
    
    try {
      switch (signalingData.type) {
        case 'offer':
          await pc.setRemoteDescription(signalingData.offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          // Send answer back to backend
          if (webSocketRefs.current.main) {
            webSocketRefs.current.main.send(JSON.stringify({
              type: 'webrtc_answer',
              data: {
                camera_id: cameraId,
                answer: answer
              }
            }));
          }
          break;
          
        case 'ice-candidate':
          await pc.addIceCandidate(signalingData.candidate);
          break;
      }
    } catch (error) {
      console.error('WebRTC signaling error:', error);
    }
  };

  // Handle MJPEG frame data
  const handleMJPEGFrame = (cameraId, frameData) => {
    const videoElement = videoRefs.current[cameraId];
    if (!videoElement) return;
    
    // Convert base64 frame to blob URL
    const byteCharacters = atob(frameData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    
    videoElement.src = url;
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Handle HLS playlist updates
  const handleHLSUpdate = (cameraId, hlsData) => {
    const hls = hlsInstances.current[cameraId];
    if (hls && hlsData.playlist_url) {
      hls.loadSource(hlsData.playlist_url);
    }
  };

  // Update camera status from WebSocket
  const updateCameraStatus = (statusData) => {
    const { camera_id, status } = statusData;
    setStreamHealth(prev => ({
      ...prev,
      [camera_id]: { 
        ...prev[camera_id], 
        status: status,
        lastUpdate: Date.now()
      }
    }));
  };

  // Monitor stream health
  useEffect(() => {
    const interval = setInterval(() => {
      checkStreamHealth();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeStream = async (camera) => {
    try {
      const videoElement = videoRefs.current[camera.id];
      
      if (!videoElement) return;

      // Request stream from FastAPI backend via WebSocket
      if (webSocketRefs.current.main && webSocketRefs.current.main.readyState === WebSocket.OPEN) {
        webSocketRefs.current.main.send(JSON.stringify({
          type: 'start_stream',
          data: {
            camera_id: camera.id,
            stream_type: streamType,
            quality: 'high'
          }
        }));
      }

      switch (streamType) {
        case 'hls':
          await initializeHLSStream(camera, null, videoElement);
          break;
        case 'webrtc':
          await initializeWebRTCStream(camera, null, videoElement);
          break;
        case 'mjpeg':
          await initializeMJPEGStream(camera, null, videoElement);
          break;
      }
      
      setStreamHealth(prev => ({
        ...prev,
        [camera.id]: { status: 'connecting', lastUpdate: Date.now() }
      }));
    } catch (error) {
      console.error(`Failed to initialize stream for ${camera.name}:`, error);
      setStreamHealth(prev => ({
        ...prev,
        [camera.id]: { status: 'error', error: error.message, lastUpdate: Date.now() }
      }));
    }
  };

  const initializeHLSStream = async (camera, streamUrl, videoElement) => {
    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);
      
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
      
      hls.on(window.Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
      
      hlsInstances.current[camera.id] = hls;
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = streamUrl;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
      });
    }
  };

  const initializeWebRTCStream = async (camera, streamUrl, videoElement) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    pc.ontrack = (event) => {
      videoElement.srcObject = event.streams[0];
      videoElement.play();
      
      setStreamHealth(prev => ({
        ...prev,
        [camera.id]: { status: 'connected', lastUpdate: Date.now() }
      }));
    };
    
    pc.onicecandidate = (event) => {
      if (event.candidate && webSocketRefs.current.main) {
        webSocketRefs.current.main.send(JSON.stringify({
          type: 'webrtc_ice_candidate',
          data: {
            camera_id: camera.id,
            candidate: event.candidate
          }
        }));
      }
    };
    
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      
      const statusMap = {
        'connecting': 'connecting',
        'connected': 'connected',
        'disconnected': 'disconnected',
        'failed': 'error',
        'closed': 'disconnected'
      };
      
      const status = statusMap[pc.iceConnectionState] || 'unknown';
      setStreamHealth(prev => ({
        ...prev,
        [camera.id]: { status, lastUpdate: Date.now() }
      }));
    };
    
    // Request WebRTC offer from backend
    if (webSocketRefs.current.main) {
      webSocketRefs.current.main.send(JSON.stringify({
        type: 'webrtc_offer_request',
        data: {
          camera_id: camera.id
        }
      }));
    }
    
    hlsInstances.current[camera.id] = pc; // Store for cleanup
  };

  const initializeMJPEGStream = async (camera, streamUrl, videoElement) => {
    // For MJPEG, we'll receive frames via WebSocket
    // The handleMJPEGFrame function will handle the actual frame updates
    
    setStreamHealth(prev => ({
      ...prev,
      [camera.id]: { status: 'connecting', lastUpdate: Date.now() }
    }));
  };

  const getStreamUrl = (camera) => {
    const baseUrl = `http://${camera.ip}:${camera.port || 8080}`;
    
    switch (streamType) {
      case 'hls':
        return `${baseUrl}/stream.m3u8`;
      case 'webrtc':
        return `ws://${camera.ip}:${camera.port || 8080}/webrtc`;
      case 'mjpeg':
        return `${baseUrl}/video.mjpg`;
      default:
        return `${baseUrl}/stream.m3u8`;
    }
  };

  const checkStreamHealth = () => {
    Object.keys(streamHealth).forEach(cameraId => {
      const health = streamHealth[cameraId];
      const timeSinceUpdate = Date.now() - health.lastUpdate;
      
      if (timeSinceUpdate > 10000) { // 10 seconds
        setStreamHealth(prev => ({
          ...prev,
          [cameraId]: { ...health, status: 'disconnected' }
        }));
      }
    });
  };

  const startRecording = (camera) => {
    // Send recording request to FastAPI backend
    if (webSocketRefs.current.main && webSocketRefs.current.main.readyState === WebSocket.OPEN) {
      webSocketRefs.current.main.send(JSON.stringify({
        type: 'start_recording',
        data: {
          camera_id: camera.id,
          duration: 30 // 30 seconds
        }
      }));
    }
    
    setIsRecording(prev => ({ ...prev, [camera.id]: true }));
  };

  const stopRecording = (camera) => {
    // Send stop recording request to FastAPI backend
    if (webSocketRefs.current.main && webSocketRefs.current.main.readyState === WebSocket.OPEN) {
      webSocketRefs.current.main.send(JSON.stringify({
        type: 'stop_recording',
        data: {
          camera_id: camera.id
        }
      }));
    }
    
    setIsRecording(prev => ({ ...prev, [camera.id]: false }));
  };

  const takeSnapshot = (camera) => {
    // Send snapshot request to FastAPI backend
    if (webSocketRefs.current.main && webSocketRefs.current.main.readyState === WebSocket.OPEN) {
      webSocketRefs.current.main.send(JSON.stringify({
        type: 'take_snapshot',
        data: {
          camera_id: camera.id
        }
      }));
    }
    
    // For local fallback, also capture from video element
    const videoElement = videoRefs.current[camera.id];
    if (videoElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      ctx.drawImage(videoElement, 0, 0);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${camera.name}_snapshot_${new Date().toISOString()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
  };

  const handleCameraDoubleClick = (camera) => {
    setFullViewCamera(camera);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleCloseFullView = () => {
    setFullViewCamera(null);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setShowMiniNav(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  const handleFullViewDoubleClick = () => {
    handleCloseFullView();
  };

  const handleMiniNavToggle = () => {
    setShowMiniNav(prev => !prev);
  };

  const handleMiniNavSelect = (section) => {
    // Dispatch custom event to change section
    window.dispatchEvent(new CustomEvent('changeSection', { detail: section }));
    setShowMiniNav(false);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getGridClass = () => {
    const gridClasses = {
      1: 'grid-cols-1',
      4: 'grid-cols-2',
      9: 'grid-cols-3',
      16: 'grid-cols-4'
    };
    return gridClasses[gridSize] || 'grid-cols-2';
  };

  const getStreamComponent = (camera) => {
    const health = streamHealth[camera.id];
    const isConnected = health?.status === 'connected';
    const isError = health?.status === 'error';
    
    return (
      <div className="relative w-full h-full">
        <video
          ref={el => videoRefs.current[camera.id] = el}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          controls={false}
        />
        
        {/* Loading/Error Overlay */}
        {!isConnected && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            {isError ? (
              <div className="text-center text-red-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Stream Error</p>
                <p className="text-xs mt-1">{health?.error}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm">Connecting...</p>
              </div>
            )}
          </div>
        )}
        
        {/* Stream Health Indicator */}
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 
            isError ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span className="text-xs text-white bg-black bg-opacity-75 px-1 py-0.5 rounded">
            {streamType.toUpperCase()}
          </span>
        </div>
        
        {/* Recording Indicator */}
        {isRecording[camera.id] && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>REC</span>
          </div>
        )}
      </div>
    );
  };

  const getCameraStream = (camera) => {
    // Fallback placeholder for cameras without proper stream setup
    return `https://via.placeholder.com/640x480/1a1a1a/ffffff?text=${camera.name}`;
  };

  const onlineCameras = cameras ? cameras.filter(camera => camera.status === 'online') : [];
  const displayCameras = onlineCameras.slice(0, gridSize);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Live View</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-300">
              {wsConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Stream:</label>
            <select 
              value={streamType} 
              onChange={(e) => setStreamType(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
            >
              {streamTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Grid:</label>
            <select 
              value={gridSize} 
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="px-3 py-1 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
            >
              {gridSizes.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-900 rounded-lg p-4">
        <div className={`grid ${getGridClass()} gap-4 h-full`}>
          {displayCameras.map((camera) => (
            <div
              key={camera.id}
              className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
              onClick={() => handleCameraClick(camera)}
              onDoubleClick={() => handleCameraDoubleClick(camera)}
            >
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                {getStreamComponent(camera)}
              </div>
              
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
                {camera.name}
              </div>
              
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded">
                {camera.ip}
              </div>
              
              {/* Camera Controls */}
              <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    takeSnapshot(camera);
                  }}
                  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors"
                  title="Take Snapshot"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isRecording[camera.id]) {
                      stopRecording(camera);
                    } else {
                      startRecording(camera);
                    }
                  }}
                  className={`${
                    isRecording[camera.id] ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  } text-white p-1 rounded transition-colors`}
                  title={isRecording[camera.id] ? 'Stop Recording' : 'Start Recording'}
                >
                  {isRecording[camera.id] ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12v12H6z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: gridSize - displayCameras.length }, (_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-video bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center"
            >
              <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No Camera</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full View Modal */}
      {fullViewCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Navigation Toggle Button */}
            <button
              onClick={handleMiniNavToggle}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity"
              title="Toggle Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mini Navigation Panel */}
            {showMiniNav && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-90 rounded-lg p-3 min-w-48">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMiniNavSelect('live')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>📹</span>
                    <span>Live View</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('playback')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>⏯️</span>
                    <span>Playback</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('cameras')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>📷</span>
                    <span>Cameras</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('network')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>🌐</span>
                    <span>Network</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('video')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>🎥</span>
                    <span>Video</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('audio')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>🔊</span>
                    <span>Audio</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('storage')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors"
                  >
                    <span>💾</span>
                    <span>Storage</span>
                  </button>
                  <button
                    onClick={() => handleMiniNavSelect('system')}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-600 rounded text-sm transition-colors col-span-2"
                  >
                    <span>⚙️</span>
                    <span>System</span>
                  </button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={handleCloseFullView}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 rounded-lg p-2 space-y-2">
              <button
                onClick={handleZoomIn}
                className="block w-10 h-10 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="Zoom In"
              >
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={handleZoomOut}
                className="block w-10 h-10 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="Zoom Out"
              >
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={handleZoomReset}
                className="block w-10 h-10 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                title="Reset Zoom"
              >
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute top-4 left-20 z-10 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>

            {/* Camera Info */}
            <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-75 text-white px-4 py-2 rounded">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{fullViewCamera.name}</span>
                <span className="text-sm text-gray-300">{fullViewCamera.ip}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    fullViewCamera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm">{fullViewCamera.status}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
              <button 
                onClick={() => {
                  if (isRecording[fullViewCamera.id]) {
                    stopRecording(fullViewCamera);
                  } else {
                    startRecording(fullViewCamera);
                  }
                }}
                className={`${
                  isRecording[fullViewCamera.id] ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                } text-white px-4 py-2 rounded transition-colors`}
              >
                {isRecording[fullViewCamera.id] ? 'Stop Recording' : 'Record'}
              </button>
              <button 
                onClick={() => takeSnapshot(fullViewCamera)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Snapshot
              </button>
            </div>

            {/* Full View Video Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onDoubleClick={handleFullViewDoubleClick}
            >
              <video
                ref={el => videoRefs.current[`fullview_${fullViewCamera.id}`] = el}
                className="max-w-full max-h-full object-contain select-none"
                autoPlay
                muted
                playsInline
                controls={false}
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onLoadedMetadata={() => {
                  // Initialize fullscreen stream
                  initializeStream({ ...fullViewCamera, id: `fullview_${fullViewCamera.id}` });
                }}
              />
              
              {/* Fullscreen Loading/Error Overlay */}
              {(!streamHealth[`fullview_${fullViewCamera.id}`] || streamHealth[`fullview_${fullViewCamera.id}`]?.status !== 'connected') && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading Live Stream...</p>
                    <p className="text-sm text-gray-300 mt-2">{fullViewCamera.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-75 text-white px-4 py-2 rounded text-sm">
              Double-click to exit • Use zoom controls or mouse wheel • Drag to pan when zoomed
            </div>
          </div>
        </div>
      )}

      {/* Camera Info Panel */}
      {selectedCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedCamera.name}</h3>
              <button
                onClick={() => setSelectedCamera(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">IP Address:</span>
                <span className="text-white">{selectedCamera.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={`${selectedCamera.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedCamera.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Stream:</span>
                <span className="text-white text-sm">{selectedCamera.stream}</span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => {
                  setSelectedCamera(null);
                  handleCameraDoubleClick(selectedCamera);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex-1"
              >
                View Full Screen
              </button>
              <button 
                onClick={() => {
                  takeSnapshot(selectedCamera);
                  setSelectedCamera(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex-1"
              >
                Snapshot
              </button>
              <button 
                onClick={() => {
                  if (isRecording[selectedCamera.id]) {
                    stopRecording(selectedCamera);
                  } else {
                    startRecording(selectedCamera);
                  }
                  setSelectedCamera(null);
                }}
                className={`${
                  isRecording[selectedCamera.id] ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white px-4 py-2 rounded transition-colors flex-1`}
              >
                {isRecording[selectedCamera.id] ? 'Stop Rec' : 'Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveView;
