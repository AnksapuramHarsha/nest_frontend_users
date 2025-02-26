import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // For React 18
import './index.css'; // Your styles
import App from './App'; // Import your main App component
import { AuthProvider } from './contexts/AuthContext'; // Ensure the correct import path

// Ensure your 'root' element exists in your index.html file
const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
