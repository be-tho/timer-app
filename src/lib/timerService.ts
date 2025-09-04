import { supabase } from './supabase'
import type { Database } from './supabase'
import type { Project, TimeSession } from '../store/timerStore'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type SessionRow = Database['public']['Tables']['sessions']['Row']

export class TimerService {
  // Convertir de Row a Project
  private static projectFromRow(row: ProjectRow): Project {
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      totalTime: row.total_time,
      ratePerHour: row.rate_per_hour,
      createdAt: new Date(row.created_at),
      sessions: [] // Se cargarán por separado
    }
  }

  // Convertir de Project a Row
  private static projectToRow(project: Omit<Project, 'sessions'>): Database['public']['Tables']['projects']['Insert'] {
    return {
      id: project.id,
      name: project.name,
      description: project.description || null,
      total_time: project.totalTime,
      rate_per_hour: project.ratePerHour,
      created_at: project.createdAt.toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // Convertir de Row a TimeSession
  private static sessionFromRow(row: SessionRow): TimeSession {
    return {
      id: row.id,
      projectId: row.project_id,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      duration: row.duration,
      isActive: false,
      notes: row.notes || undefined
    }
  }

  // Convertir de TimeSession a Row
  private static sessionToRow(session: TimeSession): Database['public']['Tables']['sessions']['Insert'] {
    return {
      id: session.id,
      project_id: session.projectId,
      start_time: session.startTime.toISOString(),
      end_time: session.endTime?.toISOString() || null,
      duration: session.duration,
      notes: session.notes || null,
      created_at: new Date().toISOString()
    }
  }

  // Cargar todos los proyectos con sus sesiones
  static async loadProjects(): Promise<Project[]> {
    try {
      // Cargar proyectos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      // Cargar sesiones para cada proyecto
      const projectsWithSessions = await Promise.all(
        projectsData.map(async (projectRow) => {
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('sessions')
            .select('*')
            .eq('project_id', projectRow.id)
            .order('start_time', { ascending: false })

          if (sessionsError) throw sessionsError

          const project = this.projectFromRow(projectRow)
          project.sessions = sessionsData.map(session => this.sessionFromRow(session))
          
          return project
        })
      )

      return projectsWithSessions
    } catch (error) {
      console.error('Error loading projects:', error)
      throw error
    }
  }

  // Crear nuevo proyecto
  static async createProject(projectData: Omit<Project, 'id' | 'totalTime' | 'sessions' | 'createdAt'>): Promise<Project> {
    try {
      const newProject: Project = {
        ...projectData,
        id: crypto.randomUUID(),
        totalTime: 0,
        sessions: [],
        createdAt: new Date()
      }

      const { error } = await supabase
        .from('projects')
        .insert(this.projectToRow(newProject))

      if (error) throw error

      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  // Actualizar proyecto
  static async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      const updateData: any = {}
      
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.totalTime !== undefined) updateData.total_time = updates.totalTime
      if (updates.ratePerHour !== undefined) updateData.rate_per_hour = updates.ratePerHour
      
      updateData.updated_at = new Date().toISOString()

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  // Eliminar proyecto
  static async deleteProject(id: string): Promise<void> {
    try {
      // Eliminar sesiones primero (foreign key constraint)
      const { error: sessionsError } = await supabase
        .from('sessions')
        .delete()
        .eq('project_id', id)

      if (sessionsError) throw sessionsError

      // Eliminar proyecto
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (projectError) throw projectError
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // Agregar sesión
  static async addSession(session: TimeSession): Promise<void> {
    try {
      const { error } = await supabase
        .from('sessions')
        .insert(this.sessionToRow(session))

      if (error) throw error
    } catch (error) {
      console.error('Error adding session:', error)
      throw error
    }
  }

  // Actualizar sesión
  static async updateSession(id: string, updates: Partial<TimeSession>): Promise<void> {
    try {
      const updateData: any = {}
      
      if (updates.endTime !== undefined) updateData.end_time = updates.endTime.toISOString()
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.notes !== undefined) updateData.notes = updates.notes

      const { error } = await supabase
        .from('sessions')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating session:', error)
      throw error
    }
  }

  // Sincronizar proyecto completo (proyecto + sesiones)
  static async syncProject(project: Project): Promise<void> {
    try {
      // Actualizar proyecto
      await this.updateProject(project.id, project)

      // Sincronizar sesiones
      for (const session of project.sessions) {
        const existingSession = await supabase
          .from('sessions')
          .select('id')
          .eq('id', session.id)
          .single()

        if (existingSession.data) {
          await this.updateSession(session.id, session)
        } else {
          await this.addSession(session)
        }
      }
    } catch (error) {
      console.error('Error syncing project:', error)
      throw error
    }
  }
}
