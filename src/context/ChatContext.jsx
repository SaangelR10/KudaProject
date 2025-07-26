import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useFinancialData } from './FinancialDataContext'
import dialogflowService from '../services/dialogflowService'

const ChatContext = createContext()

const initialState = {
  messages: [
    {
      id: 'welcome',
      type: 'bot',
      content: '¡Hola! Soy FinBot Pro, tu experto financiero inteligente 🤖💰\n\nPuedo ayudarte a:\n• Registrar gastos e ingresos\n• Analizar tu presupuesto\n• Crear metas de ahorro\n• Dar recomendaciones personalizadas\n\nSolo dime qué necesitas, por ejemplo: "Gasté $50 en comida" o "¿Cómo está mi presupuesto?"',
      timestamp: new Date().toISOString()
    }
  ],
  isTyping: false,
  suggestions: [
    'Gasté $30 en transporte',
    'Recibí $500 de mi trabajo',
    'Gasté $25 en comida',
    '¿Cómo está mi presupuesto?',
    'Quiero ahorrar $1000'
  ]
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      }
    
    case 'UPDATE_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload
      }
    
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [state.messages[0]] // Keep welcome message
      }
    
    default:
      return state
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { addTransaction, getMonthlyStats, getCategoryStats, addGoal, categories } = useFinancialData()

  // AI Response Generator
  const generateAIResponse = async (userMessage, financialData) => {
    const message = userMessage.toLowerCase()
    const stats = getMonthlyStats()
    const categoryStats = getCategoryStats()
    
    // Parse transaction from user message
    const transactionMatch = message.match(/(?:gasté|gaste|gasté|pagué|pague|pagué)\s*\$?(\d+(?:\.\d+)?)\s*(?:en|por|de)\s*(.+)/i)
    const incomeMatch = message.match(/(?:recibí|recibi|ingresé|ingrese|ingresé|gané|gane|gané)\s*\$?(\d+(?:\.\d+)?)\s*(?:de|por|en)\s*(.+)/i)
    
    let response = ''
    let newTransaction = null
    
    if (transactionMatch) {
      const amount = parseFloat(transactionMatch[1])
      const description = transactionMatch[2].trim()
      
      // Determine category based on keywords
      let category = 'otros'
      const categoryKeywords = {
        comida: ['comida', 'alimento', 'restaurante', 'café', 'cafe', 'supermercado', 'mercado'],
        transporte: ['transporte', 'uber', 'taxi', 'bus', 'gasolina', 'gas', 'metro'],
        entretenimiento: ['entretenimiento', 'cine', 'película', 'pelicula', 'netflix', 'spotify', 'juego'],
        salud: ['salud', 'médico', 'medico', 'farmacia', 'medicina', 'doctor'],
        educacion: ['educación', 'educacion', 'curso', 'libro', 'universidad', 'escuela'],
        vivienda: ['vivienda', 'renta', 'alquiler', 'casa', 'departamento', 'servicios'],
        ropa: ['ropa', 'zapatos', 'vestido', 'camisa', 'pantalón', 'pantalon']
      }
      
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => description.includes(keyword))) {
          category = cat
          break
        }
      }
      
      newTransaction = addTransaction({
        type: 'expense',
        amount,
        description,
        category
      })
      
      const categoryName = categories[category]?.name || 'Otros'
      response = `Registré tu gasto de $${amount} en ${categoryName}. `
      
      // Add personalized insights
      if (stats.totalExpenses > 0) {
        const categoryPercentage = (amount / stats.totalExpenses) * 100
        if (categoryPercentage > 30) {
          response += `Este gasto representa el ${categoryPercentage.toFixed(1)}% de tus gastos mensuales. ¿Te gustaría que analicemos cómo optimizar esta categoría?`
        } else {
          response += `¿Quieres que revisemos tu presupuesto para esta categoría?`
        }
      }
      
    } else if (incomeMatch) {
      const amount = parseFloat(incomeMatch[1])
      const source = incomeMatch[2].trim()
      
      newTransaction = addTransaction({
        type: 'income',
        amount,
        description: `Ingreso de ${source}`,
        category: 'otros'
      })
      
      response = `¡Excelente! Registré tu ingreso de $${amount} de ${source}. `
      
      if (stats.totalIncome > 0) {
        const savingsRate = ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100
        if (savingsRate > 20) {
          response += `¡Muy bien! Estás ahorrando el ${savingsRate.toFixed(1)}% de tus ingresos. ¿Quieres establecer una meta de ahorro?`
        } else if (savingsRate < 0) {
          response += `Noto que tus gastos superan tus ingresos. ¿Te gustaría que creemos un plan para equilibrar tus finanzas?`
        } else {
          response += `¿Quieres que analicemos cómo aumentar tu tasa de ahorro?`
        }
      }
      
    } else if (message.includes('presupuesto') || message.includes('gastos')) {
      if (stats.totalExpenses === 0) {
        response = 'Aún no tienes gastos registrados este mes. ¡Comienza ingresando tus primeros gastos!'
      } else {
        const topCategory = categoryStats[0]
        response = `Este mes has gastado $${stats.totalExpenses} en total. Tu mayor gasto es en ${topCategory.name} ($${topCategory.amount}, ${topCategory.percentage.toFixed(1)}%). `
        
        if (stats.totalIncome > 0) {
          const remainingBudget = stats.totalIncome - stats.totalExpenses
          if (remainingBudget > 0) {
            response += `Te quedan $${remainingBudget} disponibles este mes.`
          } else {
            response += `Has superado tu presupuesto en $${Math.abs(remainingBudget)}. ¿Quieres que creemos un plan de recuperación?`
          }
        }
      }
      
    } else if (message.includes('ahorrar') || message.includes('meta')) {
      const savingsMatch = message.match(/\$?(\d+(?:\.\d+)?)/)
      if (savingsMatch) {
        const targetAmount = parseFloat(savingsMatch[1])
        const newGoal = addGoal({
          title: `Ahorrar $${targetAmount}`,
          targetAmount,
          description: 'Meta de ahorro personal'
        })
        response = `¡Perfecto! Creé una meta para ahorrar $${targetAmount}. Te ayudaré a alcanzarla con consejos personalizados y retos semanales.`
      } else {
        response = '¿Cuánto te gustaría ahorrar? Puedes decirme algo como "Quiero ahorrar $1000" y crearé una meta personalizada para ti.'
      }
      
    } else if (message.includes('ayuda') || message.includes('qué') || message.includes('que')) {
      response = 'Puedo ayudarte a:\n• Registrar gastos e ingresos\n• Analizar tu presupuesto\n• Crear metas de ahorro\n• Dar recomendaciones personalizadas\n\nSolo dime qué necesitas, por ejemplo: "Gasté $50 en comida" o "¿Cómo está mi presupuesto?"'
      
    } else {
      response = 'No entendí completamente. Puedes decirme cosas como:\n• "Gasté $30 en transporte"\n• "Recibí $500 de mi trabajo"\n• "¿Cómo está mi presupuesto?"\n• "Quiero ahorrar $1000"'
    }
    
    return response
  }

  const sendMessage = async (content) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    }
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    dispatch({ type: 'SET_TYPING', payload: true })
    
    try {
      // Get current financial data
      const stats = getMonthlyStats()
      const financialData = {
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        savings: stats.savings,
        monthlyBudget: monthlyBudget
      }
      
      // Send to Dialogflow
      const dialogflowResponse = await dialogflowService.sendMessage(content, financialData)
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: dialogflowResponse.text,
        timestamp: new Date().toISOString()
      }
      
      dispatch({ type: 'ADD_MESSAGE', payload: botMessage })
      
      // Handle actions from Dialogflow
      if (dialogflowResponse.action === 'ADD_TRANSACTION') {
        addTransaction(dialogflowResponse.data)
      } else if (dialogflowResponse.action === 'ADD_GOAL') {
        addGoal(dialogflowResponse.data)
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Lo siento, tuve un problema procesando tu mensaje. ¿Puedes intentar de nuevo?',
        timestamp: new Date().toISOString()
      }
      
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage })
    }
    
    dispatch({ type: 'SET_TYPING', payload: false })
    
    // Update suggestions based on context
    const newSuggestions = [
      '¿Cómo está mi presupuesto?',
      'Quiero ahorrar $500',
      'Gasté $40 en entretenimiento',
      'Recibí $800 de mi trabajo',
      'Analiza mis gastos',
      'Dame consejos de ahorro'
    ]
    dispatch({ type: 'UPDATE_SUGGESTIONS', payload: newSuggestions })
  }

  const value = {
    messages: state.messages,
    isTyping: state.isTyping,
    suggestions: state.suggestions,
    sendMessage,
    generateAIResponse
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}