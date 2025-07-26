import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, BarChart3, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      path: '/',
      label: 'Chat',
      icon: MessageCircle,
      color: 'text-primary-500'
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      color: 'text-primary-500'
    },
    {
      path: '/goals',
      label: 'Metas',
      icon: Star,
      color: 'text-primary-500'
    }
  ]

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary-500 bg-primary-50' 
                  : 'text-gray-500 hover:text-primary-500 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={24} className={isActive ? 'text-primary-500' : 'text-gray-500'} />
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-primary-500' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}

export default Navigation