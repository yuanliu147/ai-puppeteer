import React from 'react';
import { createRoot } from 'react-dom/client';


const root = document.getElementById('root');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = createRoot(root!);

app.render(
  <div>
    <h1>💖 Hello World!</h1>
    <h2>AI Puppeteer</h2>
    <p>Welcome to your Electron application.</p>
  </div>
)

