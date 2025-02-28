import { useState } from 'react'
import './App.css'
import TwitterPage from './components/pages/TwitterPage'
import GmailPage from './components/pages/GmailPage'
import RedditPage from './components/pages/RedditPage'
import HomePage from './components/pages/HomePage'
import SettingsPage from './components/pages/SettingsPage'

function App() {
  const [isTwitterConnected, setIsTwitterConnected] = useState(true)
  const [isGmailConnected, setIsGmailConnected] = useState(true)
  const [isRedditConnected, setIsRedditConnected] = useState(true)
  const [isFacebookConnected, setIsFacebookConnected] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  const handleTwitterConnect = () => {
    setIsTwitterConnected(true)
  }

  const handleTwitterDisconnect = () => {
    setIsTwitterConnected(false)
  }

  const handleGmailConnect = () => {
    setIsGmailConnected(true)
  }

  const handleGmailDisconnect = () => {
    setIsGmailConnected(false)
  }

  const handleRedditConnect = () => {
    setIsRedditConnected(true)
  }

  const handleRedditDisconnect = () => {
    setIsRedditConnected(false)
  }

  const handleFacebookConnect = () => {
    setIsFacebookConnected(true)
  }

  const handleFacebookDisconnect = () => {
    setIsFacebookConnected(false)
  }

  const connectedServices = {
    twitter: isTwitterConnected,
    reddit: isRedditConnected,
    gmail: isGmailConnected,
    facebook: isFacebookConnected
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <nav className="mb-8">
          <ul className="flex gap-4 flex-wrap">
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
                onClick={() => setCurrentPage('gmail')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'gmail'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Gmail
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('reddit')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'reddit'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Reddit
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
          {currentPage === 'gmail' && (
            <GmailPage
              isConnected={isGmailConnected}
              onConnect={handleGmailConnect}
              onDisconnect={handleGmailDisconnect}
            />
          )}
          {currentPage === 'reddit' && (
            <RedditPage
              isConnected={isRedditConnected}
              onConnect={handleRedditConnect}
              onDisconnect={handleRedditDisconnect}
            />
          )}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

export default App
