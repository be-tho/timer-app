import { useTimerStore } from '../store/timerStore'
import type { Project } from '../store/timerStore'
import { formatTime, calculateEarnings, formatCurrency } from '../utils/helpers'
import { 
  FolderIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

export const SummaryStats = () => {
  const { projects } = useTimerStore()

  if (projects.length === 0) return null

  const totalTime = projects.reduce((total, project) => total + project.totalTime, 0)
  const totalSessions = projects.reduce((total, project) => total + project.sessions.length, 0)
  const totalEarnings = projects.reduce((total, project) => {
    return total + calculateEarnings(project.totalTime, project.ratePerHour)
  }, 0)

  const averageRate = projects.length > 0 
    ? projects.reduce((sum, project) => sum + project.ratePerHour, 0) / projects.length 
    : 0

  // Calcular estadísticas adicionales
  const totalHours = totalTime / (1000 * 60 * 60)
  const averageSessionDuration = totalSessions > 0 ? totalTime / totalSessions : 0
  const earningsPerHour = totalHours > 0 ? totalEarnings / totalHours : 0

  // Proyecto más productivo
  const mostProductiveProject = projects.reduce((most, project) => {
    const projectEarnings = calculateEarnings(project.totalTime, project.ratePerHour)
    return projectEarnings > most.earnings ? { project, earnings: projectEarnings } : most
  }, { project: null as Project | null, earnings: 0 })

  return (
    <div className="summary-card rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
        <ChartBarIcon className="h-6 w-6 mr-2 icon-primary" />
        Resumen Total
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center stat-card p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <FolderIcon className="h-8 w-8 icon-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{projects.length}</div>
          <div className="text-secondary text-sm">Proyectos</div>
        </div>
        
        <div className="text-center stat-card p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="h-8 w-8 icon-success" />
          </div>
          <div className="text-3xl font-bold text-success">
            {formatTime(totalTime)}
          </div>
          <div className="text-secondary text-sm">Tiempo Total</div>
        </div>
        
        <div className="text-center stat-card p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="h-8 w-8 icon-warning" />
          </div>
          <div className="text-3xl font-bold text-warning">
            {totalSessions}
          </div>
          <div className="text-secondary text-sm">Sesiones</div>
        </div>
        
        <div className="text-center stat-card p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-8 w-8 icon-success" />
          </div>
          <div className="text-3xl font-bold text-success">
            {formatCurrency(totalEarnings)}
          </div>
          <div className="text-secondary text-sm">Ingresos Totales</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(averageRate)}
            </div>
            <div className="text-sm text-muted">Tarifa Promedio/h</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {formatTime(averageSessionDuration)}
            </div>
            <div className="text-sm text-muted">Duración Promedio/Sesión</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(earningsPerHour)}
            </div>
            <div className="text-sm text-muted">Ingresos Promedio/h</div>
          </div>
        </div>
      </div>

      {mostProductiveProject.project && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ArrowTrendingUpIcon className="h-6 w-6 icon-success mr-2" />
              <span className="text-lg font-semibold text-success">Proyecto Más Productivo</span>
            </div>
            <div className="text-xl font-bold text-primary mb-1">
              {mostProductiveProject.project.name}
            </div>
            <div className="text-sm text-muted">
              {formatCurrency(mostProductiveProject.earnings)} en {formatTime(mostProductiveProject.project.totalTime)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
