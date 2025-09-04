import { create } from 'zustand'
import { TimerService } from '../lib/timerService'

export interface Project {
  id: string
  name: string
  description: string
  totalTime: number
  sessions: TimeSession[]
  createdAt: Date
  ratePerHour: number
}

export interface TimeSession {
  id: string
  projectId: string
  startTime: Date
  endTime?: Date
  duration: number
  isActive: boolean
  notes?: string
}

interface TimerStore {
  projects: Project[]
  currentSession: TimeSession | null
  selectedProject: string
  currentTime: Date
  isLoading: boolean
  error: string | null
  
  // Actions
  loadProjects: () => Promise<void>
  addProject: (project: Omit<Project, 'id' | 'totalTime' | 'sessions' | 'createdAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setSelectedProject: (id: string) => void
  startTimer: (projectId: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => Promise<void>
  updateCurrentTime: () => void
  addSessionNote: (sessionId: string, note: string) => Promise<void>
  clearError: () => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  projects: [],
  currentSession: null,
  selectedProject: '',
  currentTime: new Date(),
  isLoading: false,
  error: null,

  loadProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const projects = await TimerService.loadProjects()
      set({ projects, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading projects', 
        isLoading: false 
      })
    }
  },

  addProject: async (projectData) => {
    set({ isLoading: true, error: null })
    try {
      const newProject = await TimerService.createProject(projectData)
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error creating project', 
        isLoading: false 
      })
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      await TimerService.updateProject(id, updates)
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === id ? { ...project, ...updates } : project
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating project', 
        isLoading: false 
      })
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await TimerService.deleteProject(id)
      set((state) => ({
        projects: state.projects.filter(project => project.id !== id),
        selectedProject: state.selectedProject === id ? '' : state.selectedProject,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error deleting project', 
        isLoading: false 
      })
    }
  },

  setSelectedProject: (id) => {
    set({ selectedProject: id })
  },

  startTimer: (projectId) => {
    const newSession: TimeSession = {
      id: crypto.randomUUID(),
      projectId,
      startTime: new Date(),
      duration: 0,
      isActive: true
    }
    set({ currentSession: newSession })
  },

  pauseTimer: () => {
    const { currentSession } = get()
    if (!currentSession) return

    // Solo pausar el timer, no guardar la sesión
    const pausedSession: TimeSession = {
      ...currentSession,
      isActive: false
    }
    
    set({ currentSession: pausedSession })
  },

  resumeTimer: () => {
    const { currentSession } = get()
    if (!currentSession) return

    // Reanudar el timer
    const resumedSession: TimeSession = {
      ...currentSession,
      isActive: true
    }
    
    set({ currentSession: resumedSession })
  },

  stopTimer: async () => {
    const { currentSession } = get()
    if (!currentSession) return

    const endTime = new Date()
    const duration = endTime.getTime() - currentSession.startTime.getTime()

    const updatedSession: TimeSession = {
      ...currentSession,
      endTime,
      duration,
      isActive: false
    }

    try {
      // Guardar sesión en Supabase
      await TimerService.addSession(updatedSession)

      // Actualizar proyecto localmente
      set((state) => ({
        projects: state.projects.map(project => {
          if (project.id === currentSession.projectId) {
            return {
              ...project,
              totalTime: project.totalTime + duration,
              sessions: [updatedSession, ...project.sessions]
            }
          }
          return project
        }),
        currentSession: null,
        selectedProject: ''
      }))

      // Sincronizar proyecto completo
      const updatedProject = get().projects.find(p => p.id === currentSession.projectId)
      if (updatedProject) {
        await TimerService.syncProject(updatedProject)
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error stopping timer'
      })
    }
  },

  updateCurrentTime: () => {
    set({ currentTime: new Date() })
  },

  addSessionNote: async (sessionId, note) => {
    set({ isLoading: true, error: null })
    try {
      await TimerService.updateSession(sessionId, { notes: note })
      set((state) => ({
        projects: state.projects.map(project => ({
          ...project,
          sessions: project.sessions.map(session =>
            session.id === sessionId ? { ...session, notes: note } : session
          )
        })),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error adding note', 
        isLoading: false 
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))
