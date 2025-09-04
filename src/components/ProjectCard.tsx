import { useState } from 'react'
import { TrashIcon, ClockIcon, CurrencyDollarIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useTimerStore } from '../store/timerStore'
import type { Project } from '../store/timerStore'
import { formatTime, formatDate, calculateEarnings, formatCurrency } from '../utils/helpers'
import toast from 'react-hot-toast'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [showSessions, setShowSessions] = useState(false)
  const [showAddNote, setShowAddNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const deleteProject = useTimerStore(state => state.deleteProject)
  const addSessionNote = useTimerStore(state => state.addSessionNote)

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`)) {
      deleteProject(project.id)
      toast.success('Proyecto eliminado')
    }
  }

  const handleAddNote = async (sessionId: string) => {
    if (!noteText.trim()) {
      toast.error('La nota no puede estar vacía')
      return
    }
    
    try {
      await addSessionNote(sessionId, noteText.trim())
      toast.success('Nota agregada')
      setNoteText('')
      setShowAddNote(null)
    } catch (error) {
      toast.error('Error al agregar la nota')
    }
  }

  const totalEarnings = calculateEarnings(project.totalTime, project.ratePerHour)

  return (
    <div className="project-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-primary mb-1">{project.name}</h3>
          {project.description && (
            <p className="text-secondary text-sm mb-2">{project.description}</p>
          )}
          <div className="flex items-center text-xs text-muted">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Creado {formatDate(project.createdAt)}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-danger hover:text-danger-hover text-lg p-1 rounded-full hover:bg-danger/10 transition-colors"
          title="Eliminar proyecto"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-secondary">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">Tiempo Total:</span>
          </div>
          <span className="font-mono font-semibold text-lg text-primary">{formatTime(project.totalTime)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-secondary text-sm">Sesiones:</span>
          <span className="font-semibold text-primary">{project.sessions.length}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-secondary">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm">Tarifa: ${project.ratePerHour}/h</span>
          </div>
          <span className="font-semibold text-success text-lg">
            {formatCurrency(totalEarnings)}
          </span>
        </div>
      </div>

      {project.sessions.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="w-full text-left text-primary hover:text-primary-hover text-sm font-medium transition-colors"
          >
            {showSessions ? 'Ocultar' : 'Ver'} sesiones ({project.sessions.length})
          </button>
          
          {showSessions && (
            <div className="mt-3 session-details">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {project.sessions.slice().reverse().map(session => (
                  <div key={session.id} className="text-sm text-secondary border-l-2 border-border pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span>{formatDate(session.startTime)}</span>
                      <span className="font-mono">{formatTime(session.duration)}</span>
                    </div>
                    {session.notes && (
                      <div className="text-xs text-muted mt-1 italic">
                        "{session.notes}"
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => setShowAddNote(showAddNote === session.id ? null : session.id)}
                        className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center"
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        {session.notes ? 'Editar nota' : 'Agregar nota'}
                      </button>
                    </div>
                    {showAddNote === session.id && (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Escribe una nota sobre esta sesión..."
                          className="w-full px-2 py-1 text-xs form-input rounded border-border focus:ring-1 focus:ring-primary"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddNote(session.id)}
                            className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-hover transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => {
                              setShowAddNote(null)
                              setNoteText('')
                            }}
                            className="text-xs bg-muted text-white px-2 py-1 rounded hover:bg-border transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
