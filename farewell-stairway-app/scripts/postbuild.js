const fs = require('fs');
const path = require('path');

const distHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');

if (fs.existsSync(distHtmlPath)) {
  let html = fs.readFileSync(distHtmlPath, 'utf8');

  // 1. Ensure viewport meta prevents accidental mobile browser zooming & overflow letterboxing
  const targetViewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />';
  if (html.includes('<meta name="viewport"')) {
    html = html.replace(/<meta name="viewport"[^>]*>/i, targetViewport);
  } else {
    html = html.replace('</head>', `  ${targetViewport}\n</head>`);
  }

  // 2. Add theme-color meta for browser address bar styling (matches dark navy brand)
  if (!html.includes('theme-color')) {
    html = html.replace('</head>', '  <meta name="theme-color" content="#070C1E" />\n</head>');
  }

  // 2b. Add Google Fonts
  if (!html.includes('Cormorant+Garamond')) {
    const fontsHtml = '  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n</head>';
    html = html.replace('</head>', fontsHtml);
  }

  // 3. Inject full-height, full-width zero-margin dark background CSS into reset styles
  const darkResetCss = `
      /* Farewell to Stairway full mobile viewport dark theme reset */
      html, body, #root {
        background-color: #070C1E !important;
        background: #070C1E !important;
        color: #FFFFFF;
        width: 100% !important;
        max-width: 100vw !important;
        height: 100% !important;
        min-height: 100% !important;
        min-height: 100dvh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch;
      }
      * {
        box-sizing: border-box;
      }
  `;

  if (html.includes('</style>')) {
    html = html.replace('</style>', `${darkResetCss}\n    </style>`);
  } else {
    html = html.replace('</head>', `  <style>${darkResetCss}</style>\n</head>`);
  }

  fs.writeFileSync(distHtmlPath, html, 'utf8');
  console.log('✅ postbuild.js: Successfully patched dist/index.html with mobile viewport & #070C1E dark reset.');
} else {
  console.warn('⚠️ postbuild.js: dist/index.html not found, skipping patch.');
}
