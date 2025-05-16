import React, { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="app-container">
      {currentPage === 'landing' ? (
        <LandingPage onNavigate={navigateTo} />
      ) : (
        <Dashboard onNavigateBack={() => navigateTo('landing')} />
      )}
    </div>
  )
}

export default App
