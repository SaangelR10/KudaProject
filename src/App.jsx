import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ChatbotScreen from './components/ChatbotScreen'
import DashboardScreen from './components/DashboardScreen'
import GoalsScreen from './components/GoalsScreen'
import Navigation from './components/Navigation'
import { FinancialDataProvider } from './context/FinancialDataContext'
import { ChatProvider } from './context/ChatContext'

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Cargando Asistente Financiero...</h2>
          <p className="text-gray-500 mt-2">Preparando tu experiencia personalizada</p>
        </div>
      </div>
    )
  }

  return (
    <FinancialDataProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="flex-1 pb-20">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatbotScreen />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DashboardScreen />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/goals" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GoalsScreen />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </main>
          <Navigation />
        </div>
      </ChatProvider>
    </FinancialDataProvider>
  )
}

export default App