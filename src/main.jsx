import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles/global.css';
import './styles/animations.css';
import './styles/admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route
          path="/*"
          element={
            <CartProvider>
              <App />
            </CartProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
