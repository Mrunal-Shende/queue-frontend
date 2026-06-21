import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Global Components
import Navbar from './components/Navbar' // 🟢 INJECTED GLOBAL MINIMALIST NAV BAR

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import NearbyPlaces from './pages/nearbyplaces' 
import SelectQueueType from './pages/SelectQueueType'
import TokenConfirmed from './pages/TokenConfirmed'
import LiveQueue from './pages/LiveQueue'
import Notifications from './pages/Notifications'
import History from './pages/History'
import Profile from './pages/Profile'
import StaffPanel from './pages/StaffPanel'

// Enhanced wrapper to gracefully fall back during localized prototyping if useAuth is unconfigured
const ProtectedRoute = ({ children }) => {
  const auth = useAuth?.() || { user: { id: 1, name: "Demo User", role: "customer" } }; 
  const user = auth?.user;
  
  return user ? children : <Navigate to="/login" replace />;
}

const StaffRoute = ({ children }) => {
  const auth = useAuth?.() || { user: { id: 1, name: "Staff User", role: "staff" } };
  const user = auth?.user;
  
  return user?.role === 'staff' ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-main-layout-container" style={{ minHeight: '100vh', position: 'relative' }}>
        <Routes>
          {/* Authentication View */}
          <Route path="/login" element={<Login />} />
          
          {/* Core Customer Protected Views */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/nearby-places" element={<ProtectedRoute><NearbyPlaces /></ProtectedRoute>} />
          <Route path="/select-queue/:venueId" element={<ProtectedRoute><SelectQueueType /></ProtectedRoute>} />
          <Route path="/token-confirmed" element={<ProtectedRoute><TokenConfirmed /></ProtectedRoute>} />
          <Route path="/live-queue" element={<ProtectedRoute><LiveQueue /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Operational Staff Dashboard Protected View */}
          <Route path="/staff" element={<StaffRoute><StaffPanel /></StaffRoute>} />
          
          {/* Dynamic Fallback Catch-All Safety Net */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 🟢 GLOBAL PERSISTENT NAVBAR LAYER:
          Yeh standard routing pipeline ke niche globally mounted hai. Iske internal authentication 
          aur page context validation rules isko dynamic automatic hide/show control dete hain.
        */}
        <Navbar />
      </div>
    </BrowserRouter>
  )
}