import React, { useRef } from 'react';
import { StyleSheet, View, Platform, Linking, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function GoogleMapView({
  temples = [],
  drivers = [],
  selectedTemple,
  onSelectTemple,
  onSelectDriver,
  center = { lat: 13.7050, lng: 100.5200 } // Bangkok, Thailand center
}) {
  const webViewRef = useRef(null);

  // Generate interactive Leaflet map with Google / CartoDB tiles and custom markers
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #0F172A; }
          .temple-pin {
            background: #8B5CF6;
            color: #FFFFFF;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
          }
          .driver-pin {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #FFFFFF;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
          }
          .user-pin {
            width: 20px;
            height: 20px;
            background: #2563EB;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 14px #3B82F6;
          }
          .leaflet-popup-content-wrapper {
            background: #0F1A3A;
            color: #FFFFFF;
            border-radius: 14px;
            border: 1px solid rgba(147, 197, 253, 0.4);
            padding: 4px;
          }
          .leaflet-popup-tip { background: #0F1A3A; }
          .popup-title { font-weight: bold; font-size: 14px; margin-bottom: 3px; color: #FFFFFF; }
          .popup-sub { font-size: 11px; color: #94A3B8; margin-bottom: 4px; }
          .popup-parking { font-size: 11px; color: #86EFAC; font-weight: 600; margin-bottom: 6px; }
          .popup-link { display: inline-block; font-size: 11px; color: #93C5FD; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([${center.lat}, ${center.lng}], 12);
          
          // Google Maps road layer style tiles
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© Google Map Tiles / OpenStreetMap'
          }).addTo(map);

          // User Location Pin
          var userIcon = L.divIcon({ className: 'user-pin', iconSize: [20, 20] });
          L.marker([${center.lat}, ${center.lng}], { icon: userIcon })
            .addTo(map)
            .bindPopup("<div class='popup-title'>📍 Your Current Location</div><div class='popup-sub'>Central Bangkok, Thailand</div>");

          // Temple Markers
          ${temples.map((t) => `
            var tIcon_${t.id.replace(/-/g, '_')} = L.divIcon({
              className: 'temple-pin',
              html: '🛕',
              iconSize: [36, 36],
              iconAnchor: [18, 18]
            });
            var tMarker_${t.id.replace(/-/g, '_')} = L.marker([${t.lat}, ${t.lng}], { icon: tIcon_${t.id.replace(/-/g, '_')} })
              .addTo(map)
              .on('click', function() {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_TEMPLE', id: '${t.id}' }));
                }
              });
            tMarker_${t.id.replace(/-/g, '_')}.bindPopup(
              "<div class='popup-title'>🛕 ${t.name}</div>" +
              "<div class='popup-sub'>${t.address} • From ฿${t.pricing.small}</div>" +
              "<div class='popup-parking'>🅿️ ${t.parking?.type || 'On-site Parking'} (${t.parking?.capacity || 'Available'})</div>" +
              "<a class='popup-link' href='${t.googleMapsUrl}' target='_blank'>Open in Google Maps ↗</a>"
            );
          `).join('\n')}

          // Driver Markers
          ${drivers.map((d) => {
            const color = d.status === 'AVAILABLE' ? '#10B981' : d.status === 'ON_TRIP' ? '#3B82F6' : '#EF4444';
            return `
              var dIcon_${d.id.replace(/-/g, '_')} = L.divIcon({
                className: 'driver-pin',
                html: '<div style="background:${color};width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;">🚗</div>',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
              });
              L.marker([${d.lat}, ${d.lng}], { icon: dIcon_${d.id.replace(/-/g, '_')} })
                .addTo(map)
                .bindPopup("<div class='popup-title'>🚗 ${d.name} (${d.status})</div><div class='popup-sub'>${d.vehicle} • ETA ${d.etaMins}m</div>");
            `;
          }).join('\n')}
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_TEMPLE') {
        const found = temples.find(t => t.id === data.id);
        if (found && onSelectTemple) onSelectTemple(found);
      }
    } catch (e) {
      console.log('Map event notice:', e);
    }
  };

  // If on web, we can use an iframe or WebView
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <iframe
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '100%',
            border: 'none',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          title="Google Map"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
});
