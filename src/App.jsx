import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext'
import { PrayerProvider } from './context/PrayerContext'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Jadwal from './pages/Jadwal'
import Kiblat from './pages/Kiblat'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PrayerProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-zinc-950 dark:text-zinc-150 transition-colors duration-300 font-sans flex flex-col md:flex-row">
              {/* Desktop Sidebar Navigation */}
              <Sidebar />

              {/* Main Contents Area */}
              <div className="flex-1 flex flex-col min-h-screen md:pl-64 min-w-0">
                {/* Global Top Navbar */}
                <Navbar />

                {/* Main page scroll body */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/jadwal" element={<Jadwal />} />
                    <Route path="/kiblat" element={<Kiblat />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>

                {/* Mobile Bottom Navigation Menu */}
                <BottomNav />
              </div>
            </div>
          </Router>
        </PrayerProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
