import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatTime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const formatDuration = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export const formatDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Hoy'
  }
  if (isYesterday(date)) {
    return 'Ayer'
  }
  return format(date, 'dd/MM/yyyy', { locale: es })
}

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: es })
}

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

// Calcular ganancias en pesos argentinos
export const calculateEarnings = (totalTime: number, ratePerHour: number): number => {
  const hours = totalTime / (1000 * 60 * 60) // Convertir milisegundos a horas
  return Math.round(hours * ratePerHour)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const getCurrentSessionDuration = (startTime: Date, currentTime: Date): number => {
  return currentTime.getTime() - startTime.getTime()
}

export const generateProjectId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const validateProjectName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50
}

export const validateRatePerHour = (rate: number): boolean => {
  return rate >= 0 && rate <= 100000
}
