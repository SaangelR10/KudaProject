// Dialogflow Integration Service
const DIALOGFLOW_PROJECT_ID = process.env.REACT_APP_DIALOGFLOW_PROJECT_ID
const DIALOGFLOW_SESSION_ID = 'user-session-' + Date.now()

class DialogflowService {
  constructor() {
    this.sessionId = DIALOGFLOW_SESSION_ID
    this.projectId = DIALOGFLOW_PROJECT_ID
  }

  // Send message to Dialogflow
  async sendMessage(message, financialData = {}) {
    try {
      const response = await fetch(`https://dialogflow.googleapis.com/v2/projects/${this.projectId}/agent/sessions/${this.sessionId}:detectIntent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_DIALOGFLOW_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryInput: {
            text: {
              text: message,
              languageCode: 'es-ES'
            }
          },
          queryParams: {
            contexts: [{
              name: `projects/${this.projectId}/agent/sessions/${this.sessionId}/contexts/financial-context`,
              lifespanCount: 5,
              parameters: {
                fields: {
                  totalIncome: { numberValue: financialData.totalIncome || 0 },
                  totalExpenses: { numberValue: financialData.totalExpenses || 0 },
                  savings: { numberValue: financialData.savings || 0 },
                  monthlyBudget: { numberValue: financialData.monthlyBudget || 0 }
                }
              }
            }]
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Dialogflow API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processDialogflowResponse(data, financialData)
    } catch (error) {
      console.error('Dialogflow error:', error)
      return this.getFallbackResponse(message, financialData)
    }
  }

  // Process Dialogflow response
  processDialogflowResponse(dialogflowData, financialData) {
    const intent = dialogflowData.queryResult?.intent?.displayName
    const parameters = dialogflowData.queryResult?.parameters || {}
    const fulfillmentText = dialogflowData.queryResult?.fulfillmentText

    switch (intent) {
      case 'registrar_gasto':
        return this.handleExpenseRegistration(parameters, financialData)
      
      case 'registrar_ingreso':
        return this.handleIncomeRegistration(parameters, financialData)
      
      case 'consultar_presupuesto':
        return this.handleBudgetQuery(financialData)
      
      case 'crear_meta_ahorro':
        return this.handleSavingsGoal(parameters, financialData)
      
      case 'analizar_gastos':
        return this.handleExpenseAnalysis(financialData)
      
      case 'consejos_ahorro':
        return this.handleSavingsAdvice(financialData)
      
      default:
        return {
          text: fulfillmentText || 'No entendí completamente. ¿Puedes reformular tu mensaje?',
          action: null,
          data: null
        }
    }
  }

  // Handle expense registration
  handleExpenseRegistration(parameters, financialData) {
    const amount = parameters.number || parameters.amount
    const category = parameters.categoria_gasto || 'otros'
    const description = parameters.description || 'Gasto registrado'

    if (!amount) {
      return {
        text: '¿Cuánto gastaste? Por favor, incluye el monto en tu mensaje.',
        action: null,
        data: null
      }
    }

    const transaction = {
      type: 'expense',
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString()
    }

    return {
      text: `Registré tu gasto de $${amount} en ${this.getCategoryName(category)}. ¿Te gustaría que analice este gasto en relación a tu presupuesto?`,
      action: 'ADD_TRANSACTION',
      data: transaction
    }
  }

  // Handle income registration
  handleIncomeRegistration(parameters, financialData) {
    const amount = parameters.number || parameters.amount
    const source = parameters.fuente_ingreso || 'otros'
    const description = parameters.description || `Ingreso de ${source}`

    if (!amount) {
      return {
        text: '¿Cuánto ingresaste? Por favor, incluye el monto en tu mensaje.',
        action: null,
        data: null
      }
    }

    const transaction = {
      type: 'income',
      amount: parseFloat(amount),
      description,
      category: 'otros',
      date: new Date().toISOString()
    }

    return {
      text: `¡Excelente! Registré tu ingreso de $${amount} de ${source}. ¿Quieres que actualice tu presupuesto con este nuevo ingreso?`,
      action: 'ADD_TRANSACTION',
      data: transaction
    }
  }

  // Handle budget query
  handleBudgetQuery(financialData) {
    const { totalIncome, totalExpenses, savings, monthlyBudget } = financialData
    const remainingBudget = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    let response = `📊 **Resumen de tu presupuesto:**\n\n`
    response += `💰 Ingresos: $${totalIncome}\n`
    response += `💸 Gastos: $${totalExpenses}\n`
    response += `💳 Ahorros: $${savings}\n`
    response += `📈 Tasa de ahorro: ${savingsRate.toFixed(1)}%\n\n`

    if (remainingBudget > 0) {
      response += `✅ Te quedan $${remainingBudget} disponibles este mes.`
    } else if (remainingBudget < 0) {
      response += `⚠️ Has superado tu presupuesto en $${Math.abs(remainingBudget)}.`
    } else {
      response += `🎯 Has gastado exactamente tu presupuesto.`
    }

    return {
      text: response,
      action: null,
      data: null
    }
  }

  // Handle savings goal creation
  handleSavingsGoal(parameters, financialData) {
    const amount = parameters.number || parameters.amount
    const goal = parameters.goal || 'ahorro'

    if (!amount) {
      return {
        text: '¿Cuánto te gustaría ahorrar? Por ejemplo: "Quiero ahorrar $1000"',
        action: null,
        data: null
      }
    }

    const savingsGoal = {
      title: `Ahorrar $${amount} para ${goal}`,
      targetAmount: parseFloat(amount),
      currentAmount: 0,
      description: `Meta de ahorro para ${goal}`,
      createdAt: new Date().toISOString(),
      completed: false
    }

    return {
      text: `🎯 ¡Perfecto! Creé una meta para ahorrar $${amount} para ${goal}. Te ayudaré a alcanzarla con consejos personalizados y seguimiento de tu progreso.`,
      action: 'ADD_GOAL',
      data: savingsGoal
    }
  }

  // Handle expense analysis
  handleExpenseAnalysis(financialData) {
    const { totalExpenses, totalIncome } = financialData
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

    let response = `📊 **Análisis de tus gastos:**\n\n`
    response += `💸 Total gastado: $${totalExpenses}\n`
    response += `📊 Porcentaje de ingresos: ${expenseRatio.toFixed(1)}%\n\n`

    if (expenseRatio > 90) {
      response += `⚠️ Tus gastos representan el ${expenseRatio.toFixed(1)}% de tus ingresos. Considera reducir gastos para mejorar tu ahorro.`
    } else if (expenseRatio > 70) {
      response += `📈 Tus gastos están en un nivel moderado. Hay espacio para optimizar y aumentar tu ahorro.`
    } else {
      response += `✅ Excelente control de gastos. Estás en un buen camino para alcanzar tus metas financieras.`
    }

    return {
      text: response,
      action: null,
      data: null
    }
  }

  // Handle savings advice
  handleSavingsAdvice(financialData) {
    const { savings, totalIncome, totalExpenses } = financialData
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    let response = `💡 **Consejos para mejorar tu ahorro:**\n\n`

    if (savingsRate < 10) {
      response += `🎯 **Meta inmediata:** Aumentar tu tasa de ahorro al 10%\n`
      response += `💡 **Estrategia:** Aplica la regla 50/30/20\n`
      response += `📱 **Herramienta:** Usa FinBot Pro para trackear cada gasto\n\n`
      response += `¿Quieres que te ayude a crear un plan de ahorro personalizado?`
    } else if (savingsRate < 20) {
      response += `🎯 **Meta:** Llegar al 20% de ahorro\n`
      response += `💡 **Estrategia:** Automatiza tus ahorros\n`
      response += `📊 **Seguimiento:** Revisa tus gastos semanalmente\n\n`
      response += `¡Vas por buen camino! ¿Quieres establecer metas más ambiciosas?`
    } else {
      response += `🏆 **¡Excelente trabajo!** Estás ahorrando el ${savingsRate.toFixed(1)}%\n`
      response += `💡 **Siguiente paso:** Considera invertir tus ahorros\n`
      response += `🎯 **Meta:** Diversificar tus fuentes de ingreso\n\n`
      response += `¿Te interesa aprender sobre inversiones?`
    }

    return {
      text: response,
      action: null,
      data: null
    }
  }

  // Get category name
  getCategoryName(category) {
    const categories = {
      comida: 'Comida',
      transporte: 'Transporte',
      entretenimiento: 'Entretenimiento',
      salud: 'Salud',
      educacion: 'Educación',
      vivienda: 'Vivienda',
      ropa: 'Ropa',
      otros: 'Otros'
    }
    return categories[category] || 'Otros'
  }

  // Fallback response
  getFallbackResponse(message, financialData) {
    return {
      text: 'Lo siento, no pude procesar tu mensaje. ¿Puedes intentar con: "Gasté $50 en comida" o "¿Cómo está mi presupuesto?"',
      action: null,
      data: null
    }
  }
}

export default new DialogflowService()