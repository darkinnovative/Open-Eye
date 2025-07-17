# NVR System Eye - Live Video Streaming

## 🎥 Live Video Features

### Stream Types Supported
- **HLS (HTTP Live Streaming)** - Best for web browsers, adaptive bitrate
- **WebRTC** - Ultra-low latency, real-time streaming
- **MJPEG** - Motion JPEG, compatible with most IP cameras

### 🔧 Live Video Capabilities

#### Grid View
- **Multiple Grid Sizes**: 1x1, 2x2, 3x3, 4x4 camera layouts
- **Stream Type Selection**: Switch between HLS, WebRTC, and MJPEG
- **Real-time Health Monitoring**: Visual indicators for stream status
- **Hover Controls**: Quick snapshot and recording buttons

#### Camera Controls
- **Take Snapshot**: Capture current frame as PNG
- **Record Video**: Start/stop recording with auto-download
- **Full Screen Mode**: Double-click any camera for full view
- **Stream Health**: Real-time connection status indicators

#### Full Screen Features
- **Zoom & Pan**: Mouse wheel zoom, drag to pan when zoomed
- **Quick Navigation**: Mini navigation panel for easy switching
- **Recording Controls**: Start/stop recording in full screen
- **Stream Information**: Camera details and connection status

### 📡 Stream Configuration

#### Camera Setup
Each camera supports:
```javascript
{
  id: 1,
  name: 'Front Door',
  ip: '192.168.1.100',
  port: 8080,
  status: 'online',
  stream: 'rtsp://192.168.1.100:554/stream1',
  type: 'IP',
  resolution: '1920x1080',
  fps: 30,
  location: 'Entrance'
}
```

#### Stream URLs
- **HLS**: `http://camera-ip:8080/stream.m3u8`
- **WebRTC**: `ws://camera-ip:8080/webrtc`
- **MJPEG**: `http://camera-ip:8080/video.mjpg`

### 🎛️ Stream Management

#### Automatic Features
- **Auto-reconnection**: Streams automatically reconnect on failure
- **Health Monitoring**: 5-second interval health checks
- **Stream Optimization**: Adaptive streaming based on network conditions
- **Resource Cleanup**: Proper cleanup of video streams and resources

#### Manual Controls
- **Stream Type Toggle**: Switch between HLS, WebRTC, MJPEG
- **Grid Size Control**: Adjust number of simultaneous streams
- **Recording Management**: Start/stop recording with 30-second auto-stop
- **Snapshot Capture**: Instant image capture with auto-download

### 🔧 Technical Implementation

#### Key Components
- **LiveView.jsx**: Main live streaming component
- **Stream Utilities**: HLS.js, WebRTC, MJPEG streaming helpers
- **Health Monitoring**: Real-time stream status tracking
- **Recording System**: MediaRecorder API for video capture

#### Browser Compatibility
- **Chrome/Edge**: Full support (HLS, WebRTC, MJPEG)
- **Firefox**: HLS + MJPEG support
- **Safari**: Native HLS + MJPEG support
- **Mobile**: Optimized for touch devices

### 🚀 Usage

1. **Select Stream Type**: Choose HLS, WebRTC, or MJPEG from dropdown
2. **Choose Grid Layout**: Select 1x1, 2x2, 3x3, or 4x4 view
3. **Monitor Streams**: Watch live video feeds with health indicators
4. **Interact with Cameras**: Click for info, double-click for full screen
5. **Control Recording**: Use hover controls or full-screen buttons
6. **Capture Snapshots**: Click snapshot button for instant image capture

### 📊 Performance Features

- **Low Latency**: WebRTC provides sub-second delay
- **Adaptive Bitrate**: HLS adjusts quality based on network
- **Resource Efficient**: Automatic cleanup prevents memory leaks
- **Concurrent Streams**: Support for multiple simultaneous streams
- **Network Resilience**: Auto-reconnection on network issues

### 🔒 Security Considerations

- **CORS Support**: Proper cross-origin resource sharing
- **Stream Authentication**: Ready for token-based authentication
- **Secure Protocols**: HTTPS/WSS support for production
- **Input Validation**: Sanitized stream URLs and parameters

### 🎯 Future Enhancements

- **Audio Streaming**: Two-way audio communication
- **PTZ Controls**: Pan, tilt, zoom camera control
- **Stream Analytics**: Bandwidth usage and quality metrics
- **Cloud Recording**: Remote storage integration
- **Motion Detection**: Real-time motion alerts in streams

## 🔧 Development Setup

The live video system is ready to use with your existing NVR infrastructure. Simply configure your camera IP addresses and stream endpoints in the camera configuration.

### Testing with Demo Cameras
The system includes 5 demo cameras with different configurations:
- Front Door (192.168.1.100)
- Back Yard (192.168.1.101)
- Living Room (192.168.1.102)
- Garage (192.168.1.103 - offline)
- Parking Lot (192.168.1.104)

Navigate to the Live View section to see the streaming interface in action!
