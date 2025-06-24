// Step 1: Install React Router (if not installed)
// npm install react-router-dom
// npm install -D @types/react-router-dom

// Step 2: client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { Outlet } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import MemoriesPage from './pages/memory/MemoriesPage';

// Create the test component first
import AuthTest from './components/AuthTest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Outlet />
                </AppLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="memories" element={<MemoriesPage />} />
            {/* Add other protected routes here, for example: */}
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Helper to wrap AppLayout and render Outlet
function AppLayoutWrapper() {
  return <AppLayout><Outlet /></AppLayout>;
}

export default App;