import { registerRootComponent } from 'expo';

import { Platform } from 'react-native';
import App from './App';

// For web mobile viewports (e.g. mobile Brave/Chrome), ensure #root & html/body
// use the dark background color (#070C1E) and strictly prevent horizontal zooming overflow
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  try {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', '#070C1E');

    const style = document.createElement('style');
    style.id = 'farewell-global-web-reset';
    style.textContent = `
      html, body, #root {
        background-color: #070C1E !important;
        background: #070C1E !important;
        width: 100% !important;
        max-width: 100vw !important;
        height: 100% !important;
        min-height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch;
      }
      * {
        box-sizing: border-box !important;
      }
    `;
    document.head.appendChild(style);
  } catch (e) {
    console.log('Web reset injection notice:', e);
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

