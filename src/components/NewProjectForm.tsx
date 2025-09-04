import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTimerStore } from '../store/timerStore'
import { validateProjectName } from '../utils/helpers'
import toast from 'react-hot-toast'

interface NewProjectFormProps {
  isOpen: boolean
  onClose: () => void
}

export const NewProjectForm = ({ isOpen, onClose }: NewProjectFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ratePerHour, setRatePerHour] = useState(5000)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addProject = useTimerStore(state => state.addProject)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateProjectName(name)) {
      toast.error('El nombre del proyecto debe tener entre 2 y 50 caracteres')
      return
    }

    setIsSubmitting(true)
    
    try {
      addProject({
        name: name.trim(),
        description: description.trim(),
        ratePerHour
      })
      
      toast.success('Proyecto creado exitosamente')
      setName('')
      setDescription('')
             setRatePerHour(5000)
      onClose()
    } catch (error) {
      toast.error('Error al crear el proyecto')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
      <div className="modal-content rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary">Nuevo Proyecto</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-secondary transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 form-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: E-commerce React"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 form-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Descripción del proyecto..."
              rows={3}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Tarifa por Hora ($)
            </label>
            <input
              type="number"
              value={ratePerHour}
              onChange={(e) => setRatePerHour(Number(e.target.value))}
              className="w-full px-3 py-2 form-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="5000"
              min="0"
              max="100000"
              step="100"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 bg-success text-white px-4 py-2 rounded-md hover:bg-success-hover transition-colors disabled:bg-muted disabled:cursor-not-allowed action-button"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </div>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Crear Proyecto
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-muted text-white px-4 py-2 rounded-md hover:bg-border transition-colors action-button"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
