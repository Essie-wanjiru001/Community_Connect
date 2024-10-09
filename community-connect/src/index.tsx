import React from 'react';
import { createRoot } from 'react-dom/client'; // React 18's createRoot API
import './index.css'; // Tailwind and other global CSS
import App from './App';
import { Provider } from 'react-redux'; // Redux provider for app-wide state
import { store } from './components/redux/store'; // Redux store

// Get the root container element from the HTML
const container = document.getElementById('root');

if (container) {
  // Initialize React 18's root API
  const root = createRoot(container);

  // Render the App component wrapped with the Redux Provider
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  // Handle the case where the root container is missing in the HTML
  console.error('Root container not found');
}
