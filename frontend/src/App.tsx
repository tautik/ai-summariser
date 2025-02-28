import { useState } from 'react'
import './App.css'
import TwitterPage from './components/pages/TwitterPage'
import HomePage from './components/pages/HomePage'
import SettingsPage from './components/pages/SettingsPage'

function App() {
  const [isTwitterConnected, setIsTwitterConnected] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const handleTwitterConnect = () => {
    setIsTwitterConnected(true)
  }

  const handleTwitterDisconnect = () => {
    setIsTwitterConnected(false)
  }

  const connectedServices = {
    twitter: isTwitterConnected,
    reddit: false,
    gmail: false,
    facebook: false
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <nav className="mb-8">
          <ul className="flex gap-4">
            <li>
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'home'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('twitter')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'twitter'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Twitter
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'settings'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Settings
              </button>
            </li>
          </ul>
        </nav>

        <main>
          {currentPage === 'home' && (
            <HomePage 
              connectedServices={connectedServices}
              onConnect={handleTwitterConnect}
            />
          )}
          {currentPage === 'twitter' && (
            <TwitterPage
              isConnected={isTwitterConnected}
              onConnect={handleTwitterConnect}
              onDisconnect={handleTwitterDisconnect}
            />
          )}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

export default App
