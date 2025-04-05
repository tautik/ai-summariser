import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Auth from './components/Auth'
import Sidebar from './components/Sidebar'
import TwitterPage from './components/pages/TwitterPage'
import GmailPage from './components/pages/GmailPage'
import RedditPage from './components/pages/RedditPage'
import FacebookPage from './components/pages/FacebookPage'
import AudioSummaryPage from './components/pages/AudioSummaryPage'
import SettingsPage from './components/pages/SettingsPage'

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Set to true for development
  const location = useLocation();
  const activePage = location.pathname === '/' ? 'home' : location.pathname.substring(1);
  
  const handleLogin = () => {
    setIsAuthenticated(true)
  }
  
  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const handleNavigate = (page: string) => {
    // No longer needed as we're using route-based navigation
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // If authenticated, show main layout with sidebar
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        onLogout={handleLogout} 
        onNavigate={handleNavigate} 
        activePage={activePage} 
      />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
          <Route path="/twitter" element={<TwitterPage isConnected={true} onConnect={() => {}} onDisconnect={() => {}} />} />
          <Route path="/gmail" element={<GmailPage isConnected={true} onConnect={() => {}} onDisconnect={() => {}} />} />
          <Route path="/reddit" element={<RedditPage isConnected={true} onConnect={() => {}} onDisconnect={() => {}} />} />
          <Route path="/facebook" element={<FacebookPage isConnected={true} onConnect={() => {}} onDisconnect={() => {}} />} />
          <Route path="/audio-summary" element={<AudioSummaryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
