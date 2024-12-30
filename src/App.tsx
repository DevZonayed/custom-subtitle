import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AdminPage } from './pages/AdminPage';
import { PublicPage } from './pages/PublicPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/public" element={<PublicPage />} />
            <Route path="/" element={<Navigate to="/public" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;