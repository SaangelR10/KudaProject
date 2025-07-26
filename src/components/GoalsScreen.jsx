import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar,
  MessageCircle,
  Trophy,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useFinancialData } from '../context/FinancialDataContext'
import { useChat } from '../context/ChatContext'

const GoalsScreen = () => {
  const navigate = useNavigate()
  const { goals, addGoal, updateGoalProgress, getMonthlyStats } = useFinancialData()
  const { sendMessage } = useChat()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', description: '' })

  const stats = getMonthlyStats()

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount) {
      addGoal({
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        description: newGoal.description || 'Meta personal'
      })
      setNewGoal({ title: '', targetAmount: '', description: '' })
      setShowAddGoal(false)
    }
  }

  const handleAskAI = async (question) => {
    navigate('/')
    await sendMessage(question)
  }

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getGoalStatus = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const daysSinceCreation = Math.floor((new Date() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24))
    
    if (progress >= 100) {
      return {
        status: 'completed',
        icon: Trophy,
        color: 'text-green-600',
        message: '¡Meta alcanzada!'
      }
    } else if (progress >= 75) {
      return {
        status: 'near',
        icon: TrendingUp,
        color: 'text-blue-600',
        message: '¡Casi lo logras!'
      }
    } else if (daysSinceCreation > 30 && progress < 25) {
      return {
        status: 'behind',
        icon: Clock,
        color: 'text-red-600',
        message: 'Necesitas acelerar'
      }
    } else {
      return {
        status: 'on-track',
        icon: Target,
        color: 'text-gray-600',
        message: 'En buen camino'
      }
    }
  }

  const challenges = [
    {
      id: 1,
      title: 'Reto de Ahorro Semanal',
      description: 'Ahorra $50 esta semana reduciendo gastos en comida',
      reward: '$10 extra',
      difficulty: 'Fácil',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      title: 'Reto de Transporte',
      description: 'Usa transporte público 3 días esta semana',
      reward: '$15 extra',
      difficulty: 'Medio',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      title: 'Reto de Entretenimiento',
      description: 'Reduce gastos en entretenimiento en un 30%',
      reward: '$20 extra',
      difficulty: 'Difícil',
      icon: Star,
      color: 'bg-purple-100 text-purple-800'
    }
  ]

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
            <h1 className="text-xl font-semibold text-gray-900">Metas y Retos</h1>
            <p className="text-sm text-gray-500">Alcanza tus objetivos financieros</p>
          </div>
          <motion.button
            onClick={() => setShowAddGoal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Goals Summary */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resumen de Metas</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              <p className="text-sm text-gray-500">Metas activas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {goals.filter(g => (g.currentAmount / g.targetAmount) * 100 >= 100).length}
              </p>
              <p className="text-sm text-gray-500">Completadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                ${goals.reduce((sum, g) => sum + g.currentAmount, 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">Total ahorrado</p>
            </div>
          </div>
        </motion.div>

        {/* Goals List */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Mis Metas</h3>
            <motion.button
              onClick={() => handleAskAI('¿Qué metas de ahorro me recomiendas?')}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Preguntar a la IA
            </motion.button>
          </div>

          <AnimatePresence>
            {goals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const goalStatus = getGoalStatus(goal)
              const StatusIcon = goalStatus.icon

              return (
                <motion.div
                  key={goal.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{goal.title}</h4>
                        <StatusIcon className={`w-5 h-5 ${goalStatus.color}`} />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                      <p className="text-sm text-gray-600">
                        ${goal.currentAmount} de ${goal.targetAmount} ({progress.toFixed(1)}%)
                      </p>
                    </div>
                    {progress >= 100 && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Progreso</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Creada el {new Date(goal.createdAt).toLocaleDateString('es-ES')}
                    </p>
                    <motion.button
                      onClick={() => handleAskAI(`¿Cómo puedo alcanzar mi meta de ${goal.title} más rápido?`)}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      Consejos de la IA
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {goals.length === 0 && (
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes metas aún</h3>
              <p className="text-gray-500 mb-4">Crea tu primera meta de ahorro para comenzar tu viaje financiero</p>
              <motion.button
                onClick={() => setShowAddGoal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Crear Meta
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Challenges */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Retos Semanales</h3>
            <motion.button
              onClick={() => handleAskAI('¿Qué retos me recomiendas para ahorrar más?')}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Más retos
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge, index) => {
              const ChallengeIcon = challenge.icon
              
              return (
                <motion.div
                  key={challenge.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${challenge.color}`}>
                      <ChallengeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${challenge.color}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      Recompensa: {challenge.reward}
                    </span>
                    <motion.button
                      onClick={() => handleAskAI(`¿Cómo puedo completar el reto "${challenge.title}"?`)}
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      Participar
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Recomendaciones Personalizadas</h3>
          </div>
          
          <div className="space-y-3">
            {goals.length === 0 && (
              <motion.button
                onClick={() => handleAskAI('Quiero crear mi primera meta de ahorro')}
                className="w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">🎯 Crear mi primera meta de ahorro</p>
                <p className="text-sm opacity-90">Basado en tus ingresos y gastos</p>
              </motion.button>
            )}
            
            {stats.savings < 0 && (
              <motion.button
                onClick={() => handleAskAI('Necesito metas para salir de deudas')}
                className="w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">💪 Metas para salir de deudas</p>
                <p className="text-sm opacity-90">Plan personalizado de recuperación</p>
              </motion.button>
            )}
            
            <motion.button
              onClick={() => handleAskAI('¿Qué retos semanales me recomiendas?')}
              className="w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-medium">⚡ Retos semanales personalizados</p>
              <p className="text-sm opacity-90">Basado en tus patrones de gasto</p>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nueva Meta</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la meta
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ej: Ahorrar para un viaje"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto objetivo ($)
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe tu meta..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <motion.button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={handleAddGoal}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Crear Meta
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GoalsScreen