import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Toaster, toast } from 'react-hot-toast'
import { useTimerStore } from './store/timerStore'
import { TimerDisplay } from './components/TimerDisplay'
import { NewProjectForm } from './components/NewProjectForm'
import { ProjectCard } from './components/ProjectCard'
import { SummaryStats } from './components/SummaryStats'
import './App.css'

function App() {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const { projects, isLoading, error, loadProjects, clearError } = useTimerStore()

  // Cargar proyectos al iniciar la aplicación
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Mostrar errores como toasts
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#f8fafc',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc',
            },
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            ⏱️ Timer de Programación
          </h1>
          <p className="text-secondary">
            Controla tu tiempo de programación y calcula tus ingresos
          </p>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Cargando proyectos...
            </div>
          </div>
        )}

        {/* Timer Principal */}
        <TimerDisplay />

        {/* Botón para nuevo proyecto */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-hover transition-colors action-button flex items-center mx-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Proyecto
          </button>
        </div>

        {/* Lista de Proyectos */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Resumen Total */}
        <SummaryStats />

        {/* Formulario Modal */}
        <NewProjectForm 
          isOpen={showNewProjectForm} 
          onClose={() => setShowNewProjectForm(false)} 
        />
      </div>
    </div>
  )
}

export default App
