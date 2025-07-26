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
  AlertCircle,
  PiggyBank,
  CreditCard,
  Wallet,
  Savings,
  TrendingUp2,
  Clock,
  Star,
  Zap,
  Shield,
  Award,
  PieChart as PieChartIcon,
  BarChart,
  LineChart as LineChartIcon,
  Filter,
  Download,
  Share2,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, Bar, AreaChart, Area } from 'recharts'
import { useFinancialData } from '../context/FinancialDataContext'
import { useChat } from '../context/ChatContext'

const DashboardScreen = () => {
  const navigate = useNavigate()
  const { getMonthlyStats, getCategoryStats, categories, monthlyBudget, goals, transactions } = useFinancialData()
  const { sendMessage } = useChat()
  const [isLoading, setIsLoading] = useState(false)
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  const [showSensitiveData, setShowSensitiveData] = useState(true)

  const stats = getMonthlyStats()
  const categoryStats = getCategoryStats()
  const remainingBudget = stats.totalIncome - stats.totalExpenses

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

  // Enhanced financial metrics
  const getFinancialMetrics = () => {
    const savingsRate = stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100 : 0
    const expenseRatio = stats.totalIncome > 0 ? (stats.totalExpenses / stats.totalIncome) * 100 : 0
    const avgDailyExpense = stats.totalExpenses / 30
    const daysUntilBudgetExhausted = remainingBudget > 0 ? Math.floor(remainingBudget / avgDailyExpense) : 0
    
    return {
      savingsRate: savingsRate.toFixed(1),
      expenseRatio: expenseRatio.toFixed(1),
      avgDailyExpense: avgDailyExpense.toFixed(0),
      daysUntilBudgetExhausted,
      netWorth: stats.totalIncome - stats.totalExpenses,
      monthlyGrowth: ((stats.savings - (stats.totalIncome - stats.totalExpenses)) / (stats.totalIncome - stats.totalExpenses)) * 100
    }
  }

  const metrics = getFinancialMetrics()

  // Smart alerts and insights
  const getSmartInsights = () => {
    const insights = []
    
    if (metrics.savingsRate < 10) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Tasa de ahorro baja',
        message: `Solo estás ahorrando el ${metrics.savingsRate}% de tus ingresos. Considera reducir gastos.`,
        action: 'Ver consejos de ahorro'
      })
    }
    
    if (metrics.expenseRatio > 90) {
      insights.push({
        type: 'danger',
        icon: XCircle,
        title: 'Gastos muy altos',
        message: `El ${metrics.expenseRatio}% de tus ingresos se va en gastos. Revisa tu presupuesto.`,
        action: 'Analizar gastos'
      })
    }
    
    if (metrics.daysUntilBudgetExhausted < 7 && metrics.daysUntilBudgetExhausted > 0) {
      insights.push({
        type: 'warning',
        icon: Clock,
        title: 'Presupuesto agotándose',
        message: `Te quedan solo ${metrics.daysUntilBudgetExhausted} días de presupuesto.`,
        action: 'Revisar gastos'
      })
    }
    
    if (stats.totalExpenses > 0) {
      const topCategory = categoryStats[0]
      if (topCategory && topCategory.percentage > 40) {
        insights.push({
          type: 'info',
          icon: Info,
          title: 'Concentración de gastos',
          message: `${topCategory.name} representa el ${topCategory.percentage.toFixed(1)}% de tus gastos.`,
          action: 'Diversificar gastos'
        })
      }
    }
    
    if (metrics.savingsRate > 20) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: '¡Excelente ahorro!',
        message: `Estás ahorrando el ${metrics.savingsRate}% de tus ingresos. ¡Sigue así!`,
        action: 'Ver metas de ahorro'
      })
    }
    
    return insights
  }

  const insights = getSmartInsights()

  // Quick actions
  const quickActions = [
    {
      icon: Plus,
      title: 'Agregar Ingreso',
      description: 'Registra un nuevo ingreso',
      color: 'bg-green-500',
      action: () => navigate('/chat')
    },
    {
      icon: Minus,
      title: 'Agregar Gasto',
      description: 'Registra un nuevo gasto',
      color: 'bg-red-500',
      action: () => navigate('/chat')
    },
    {
      icon: Target,
      title: 'Nueva Meta',
      description: 'Crear meta de ahorro',
      color: 'bg-blue-500',
      action: () => navigate('/goals')
    },
    {
      icon: BarChart3,
      title: 'Análisis Detallado',
      description: 'Ver reportes completos',
      color: 'bg-purple-500',
      action: () => setShowDetailedView(!showDetailedView)
    }
  ]

  // Recent transactions
  const recentTransactions = transactions.slice(-5).reverse()

  // Goals progress
  const activeGoals = goals.filter(goal => !goal.completed)

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

  // Prepare data for charts
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
        ingresos: dayIncome,
        balance: dayIncome - dayExpenses
      })
    }
    return last7Days
  }

  const weeklyData = getWeeklyData()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced Header */}
      <motion.div 
        className="bg-white border-b border-gray-200 px-4 py-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Financiero</h1>
            <p className="text-sm text-gray-500">Control total de tus finanzas</p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              {showSensitiveData ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
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
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Enhanced Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  {showSensitiveData ? `$${stats.totalIncome}` : '***'}
                </p>
                <p className="text-xs text-gray-400">Este mes</p>
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
                <p className="text-2xl font-bold text-red-600">
                  {showSensitiveData ? `$${stats.totalExpenses}` : '***'}
                </p>
                <p className="text-xs text-gray-400">Este mes</p>
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
                  {showSensitiveData ? `$${stats.savings}` : '***'}
                </p>
                <p className="text-xs text-gray-400">{metrics.savingsRate}% de ingresos</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Patrimonio</p>
                <p className={`text-2xl font-bold ${metrics.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {showSensitiveData ? `$${metrics.netWorth}` : '***'}
                </p>
                <p className="text-xs text-gray-400">Neto</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                <p className="text-xs text-gray-500 text-center">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Smart Insights */}
        {insights.length > 0 && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${
                  insight.type === 'success' ? 'border-l-green-500' :
                  insight.type === 'warning' ? 'border-l-yellow-500' :
                  insight.type === 'danger' ? 'border-l-red-500' :
                  'border-l-blue-500'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    insight.type === 'success' ? 'bg-green-100' :
                    insight.type === 'warning' ? 'bg-yellow-100' :
                    insight.type === 'danger' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    <insight.icon className={`w-4 h-4 ${
                      insight.type === 'success' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' :
                      insight.type === 'danger' ? 'text-red-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                    <button 
                      onClick={() => handleAskAI(insight.action)}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2"
                    >
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Budget Status */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
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
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  budgetStatus.status === 'good' ? 'bg-green-500' : 
                  budgetStatus.status === 'warning' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min((stats.totalExpenses / monthlyBudget) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Additional metrics */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Gasto diario promedio</p>
              <p className="text-lg font-semibold text-gray-900">${metrics.avgDailyExpense}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Días restantes</p>
              <p className="text-lg font-semibold text-gray-900">
                {metrics.daysUntilBudgetExhausted > 0 ? metrics.daysUntilBudgetExhausted : 'Sin presupuesto'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h3>
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                Ver todas →
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{categories[transaction.category]?.name || 'Otros'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {showSensitiveData ? `$${transaction.amount}` : '***'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Goals Progress */}
        {activeGoals.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Metas de Ahorro</h3>
              <button 
                onClick={() => navigate('/goals')}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
              >
                Ver todas →
              </button>
            </div>
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map((goal, index) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <motion.div
                    key={goal.id}
                    className="p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${goal.currentAmount} de ${goal.targetAmount}</span>
                      <span>Faltan ${goal.targetAmount - goal.currentAmount}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses by Category */}
          {categoryStats.length > 0 && (
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
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
            </motion.div>
          )}

          {/* Weekly Trend */}
          {weeklyData.some(day => day.gastos > 0 || day.ingresos > 0) && (
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tendencia Semanal</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Monto']} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="ingresos" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Ingresos"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gastos" 
                      stackId="1"
                      stroke="#ef4444" 
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Gastos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced AI Suggestions */}
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Recomendaciones Inteligentes</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.totalExpenses > 0 && (
              <motion.button
                onClick={() => handleAskAI('¿Cómo puedo reducir mis gastos?')}
                className="text-left p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">💡 Optimizar gastos</p>
                <p className="text-sm opacity-90">Consejos personalizados</p>
              </motion.button>
            )}
            
            {stats.savings < 0 && (
              <motion.button
                onClick={() => handleAskAI('Necesito ayuda para equilibrar mis finanzas')}
                className="text-left p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">⚖️ Plan de recuperación</p>
                <p className="text-sm opacity-90">Equilibrar finanzas</p>
              </motion.button>
            )}
            
            <motion.button
              onClick={() => handleAskAI('¿Qué metas de ahorro me recomiendas?')}
              className="text-left p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-medium">🎯 Metas inteligentes</p>
              <p className="text-sm opacity-90">Basado en tu situación</p>
            </motion.button>

            <motion.button
              onClick={() => handleAskAI('¿Cómo puedo mejorar mi tasa de ahorro?')}
              className="text-left p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-medium">📈 Mejorar ahorro</p>
              <p className="text-sm opacity-90">Estrategias avanzadas</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardScreen