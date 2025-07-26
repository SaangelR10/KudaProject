import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MessageCircle,
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useFinancialData } from '../context/FinancialDataContext'
import { useChat } from '../context/ChatContext'

const DashboardScreen = () => {
  const navigate = useNavigate()
  const { getMonthlyStats, getCategoryStats, categories, monthlyBudget } = useFinancialData()
  const { sendMessage } = useChat()
  const [isLoading, setIsLoading] = useState(false)

  const stats = getMonthlyStats()
  const categoryStats = getCategoryStats()
  const remainingBudget = stats.totalIncome - stats.totalExpenses

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

  const handleAskAI = async (question) => {
    setIsLoading(true)
    navigate('/')
    await sendMessage(question)
    setIsLoading(false)
  }

  const getBudgetStatus = () => {
    if (remainingBudget > 0) {
      return {
        status: 'good',
        message: `Te quedan $${remainingBudget} disponibles`,
        icon: TrendingUp,
        color: 'text-green-600'
      }
    } else if (remainingBudget < 0) {
      return {
        status: 'warning',
        message: `Has superado tu presupuesto en $${Math.abs(remainingBudget)}`,
        icon: AlertCircle,
        color: 'text-red-600'
      }
    } else {
      return {
        status: 'neutral',
        message: 'Has gastado exactamente tu presupuesto',
        icon: Target,
        color: 'text-yellow-600'
      }
    }
  }

  const budgetStatus = getBudgetStatus()
  const StatusIcon = budgetStatus.icon

  // Prepare data for line chart (last 7 days)
  const getWeeklyData = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayTransactions = stats.transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.toDateString() === date.toDateString()
      })
      
      const dayExpenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const dayIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      last7Days.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        gastos: dayExpenses,
        ingresos: dayIncome
      })
    }
    return last7Days
  }

  const weeklyData = getWeeklyData()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-4 py-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Resumen de tus finanzas</p>
          </div>
          <motion.button
            onClick={() => handleAskAI('¿Cómo está mi presupuesto?')}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalIncome}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Gastos</p>
                <p className="text-2xl font-bold text-red-600">${stats.totalExpenses}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ahorros</p>
                <p className={`text-2xl font-bold ${stats.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats.savings}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Status */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Estado del Presupuesto</h3>
            <StatusIcon className={`w-5 h-5 ${budgetStatus.color}`} />
          </div>
          <p className={`text-lg font-medium ${budgetStatus.color}`}>
            {budgetStatus.message}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Presupuesto mensual: ${monthlyBudget}</span>
              <span>Gastado: ${stats.totalExpenses}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  budgetStatus.status === 'good' ? 'bg-green-500' : 
                  budgetStatus.status === 'warning' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min((stats.totalExpenses / monthlyBudget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Expenses by Category */}
        {categoryStats.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gastos por Categoría</h3>
              <motion.button
                onClick={() => handleAskAI('¿En qué categoría gasto más?')}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                Preguntar a la IA
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Monto']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categoryStats.map((category, index) => (
                  <motion.div
                    key={category.category}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">${category.amount}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly Trend */}
        {weeklyData.some(day => day.gastos > 0 || day.ingresos > 0) && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tendencia Semanal</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Monto']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Gastos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Ingresos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* AI Suggestions */}
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Recomendaciones de la IA</h3>
          </div>
          
          <div className="space-y-3">
            {stats.totalExpenses > 0 && (
              <motion.button
                onClick={() => handleAskAI('¿Cómo puedo reducir mis gastos?')}
                className="w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">💡 ¿Cómo puedo reducir mis gastos?</p>
                <p className="text-sm opacity-90">Obtén consejos personalizados</p>
              </motion.button>
            )}
            
            {stats.savings < 0 && (
              <motion.button
                onClick={() => handleAskAI('Necesito ayuda para equilibrar mis finanzas')}
                className="w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">⚖️ Ayuda para equilibrar mis finanzas</p>
                <p className="text-sm opacity-90">Crea un plan de recuperación</p>
              </motion.button>
            )}
            
            <motion.button
              onClick={() => handleAskAI('¿Qué metas de ahorro me recomiendas?')}
              className="w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-medium">🎯 ¿Qué metas de ahorro me recomiendas?</p>
              <p className="text-sm opacity-90">Basado en tu situación actual</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardScreen