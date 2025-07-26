import React, { createContext, useContext, useReducer, useEffect } from 'react'

const FinancialDataContext = createContext()

const initialState = {
  transactions: [],
  goals: [],
  categories: {
    comida: { name: 'Comida', color: '#FF6B6B', icon: '🍽️' },
    transporte: { name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
    entretenimiento: { name: 'Entretenimiento', color: '#45B7D1', icon: '🎮' },
    salud: { name: 'Salud', color: '#96CEB4', icon: '💊' },
    educacion: { name: 'Educación', color: '#FFEAA7', icon: '📚' },
    vivienda: { name: 'Vivienda', color: '#DDA0DD', icon: '🏠' },
    ropa: { name: 'Ropa', color: '#98D8C8', icon: '👕' },
    otros: { name: 'Otros', color: '#F7DC6F', icon: '📦' }
  },
  monthlyBudget: 2000,
  currency: 'USD'
}

const financialDataReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      }
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      }
    
    case 'UPDATE_GOAL_PROGRESS':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id 
            ? { ...goal, currentAmount: action.payload.currentAmount }
            : goal
        )
      }
    
    case 'SET_MONTHLY_BUDGET':
      return {
        ...state,
        monthlyBudget: action.payload
      }
    
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      }
    
    default:
      return state
  }
}

export const FinancialDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financialDataReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('financialData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: 'LOAD_DATA', payload: parsedData })
      } catch (error) {
        console.error('Error loading financial data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('financialData', JSON.stringify(state))
  }, [state])

  // Helper functions
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: new Date().toISOString(),
      category: transaction.category || 'otros'
    }
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction })
    return newTransaction
  }

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      createdAt: new Date().toISOString(),
      currentAmount: 0
    }
    dispatch({ type: 'ADD_GOAL', payload: newGoal })
    return newGoal
  }

  const updateGoalProgress = (goalId, amount) => {
    const goal = state.goals.find(g => g.id === goalId)
    if (goal) {
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount)
      dispatch({ 
        type: 'UPDATE_GOAL_PROGRESS', 
        payload: { id: goalId, currentAmount: newAmount }
      })
    }
  }

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const savings = totalIncome - totalExpenses

    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

    return {
      totalExpenses,
      totalIncome,
      savings,
      expensesByCategory,
      transactions: monthlyTransactions
    }
  }

  const getCategoryStats = () => {
    const stats = getMonthlyStats()
    return Object.entries(stats.expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / stats.totalExpenses) * 100,
      ...state.categories[category]
    }))
  }

  const value = {
    ...state,
    addTransaction,
    addGoal,
    updateGoalProgress,
    getMonthlyStats,
    getCategoryStats,
    dispatch
  }

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  )
}

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext)
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider')
  }
  return context
}