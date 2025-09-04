import { useEffect } from 'react'
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/outline'
import { useTimerStore } from '../store/timerStore'
import { formatTime, getCurrentSessionDuration } from '../utils/helpers'
import toast from 'react-hot-toast'

export const TimerDisplay = () => {
  const {
    projects,
    currentSession,
    selectedProject,
    currentTime,
    setSelectedProject,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateCurrentTime
  } = useTimerStore()

  // Actualizar el tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      updateCurrentTime()
    }, 1000)

    return () => clearInterval(timer)
  }, [updateCurrentTime])

  const handleStartTimer = () => {
    if (!selectedProject) {
      toast.error('Selecciona un proyecto primero')
      return
    }
    startTimer(selectedProject)
    toast.success('Timer iniciado')
  }

  const handlePauseTimer = () => {
    pauseTimer()
    toast.success('Timer pausado')
  }

  const handleResumeTimer = () => {
    resumeTimer()
    toast.success('Timer reanudado')
  }

  const handleStopTimer = () => {
    stopTimer()
    toast.success('Timer detenido')
  }

  const getCurrentProject = () => {
    return projects.find(p => p.id === selectedProject)
  }

  const currentProject = getCurrentProject()
  const currentDuration = currentSession ? getCurrentSessionDuration(currentSession.startTime, currentTime) : 0

  return (
    <div className={`project-card rounded-lg shadow-md p-6 mb-6 ${currentSession ? (currentSession.isActive ? 'timer-active' : 'timer-paused') : ''}`}>
      <div className="text-center mb-6">
        <div className={`text-6xl font-mono mb-4 timer-display ${currentSession ? (currentSession.isActive ? 'timer-active' : 'timer-paused') : ''}`}>
          {formatTime(currentDuration)}
        </div>
        <div className="text-lg text-secondary mb-2">
          {currentTime.toLocaleTimeString()}
        </div>
        {currentSession && currentProject && (
          <div className="space-y-2">
            <div className={`status-badge ${currentSession.isActive ? 'status-active' : 'status-paused'}`}>
              {currentSession.isActive ? '⏱️ Timer Activo' : '⏸️ Timer Pausado'} - {currentProject.name}
            </div>
            <div className="text-sm text-muted">
              Iniciado a las {currentSession.startTime.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
          disabled={!!currentSession}
        >
          <option value="">Seleccionar Proyecto</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
                              {project.name} (${project.ratePerHour}/h)
            </option>
          ))}
        </select>

        {!currentSession ? (
          <button
            onClick={handleStartTimer}
            disabled={!selectedProject}
            className="bg-success text-white px-6 py-2 rounded-md hover:bg-success-hover transition-colors disabled:bg-muted disabled:cursor-not-allowed action-button flex items-center"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Iniciar
          </button>
        ) : (
          <div className="flex gap-2">
            {currentSession.isActive ? (
              <button
                onClick={handlePauseTimer}
                className="bg-warning text-white px-6 py-2 rounded-md hover:bg-warning-hover transition-colors action-button flex items-center"
              >
                <PauseIcon className="h-5 w-5 mr-2" />
                Pausar
              </button>
            ) : (
              <button
                onClick={handleResumeTimer}
                className="bg-success text-white px-6 py-2 rounded-md hover:bg-success-hover transition-colors action-button flex items-center"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Reanudar
              </button>
            )}
            <button
              onClick={handleStopTimer}
              className="bg-danger text-white px-6 py-2 rounded-md hover:bg-danger-hover transition-colors action-button flex items-center"
            >
              <StopIcon className="h-5 w-5 mr-2" />
              Terminar
            </button>
          </div>
        )}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-muted">
          <p>No hay proyectos creados. Crea tu primer proyecto para comenzar.</p>
        </div>
      )}
    </div>
  )
}
