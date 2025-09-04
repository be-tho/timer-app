# ⏱️ Timer de Programación

Una aplicación moderna para controlar el tiempo de programación y calcular ingresos por proyecto. Desarrollada con React, TypeScript y Supabase.

## ✨ Características

- **Timer Inteligente**: Iniciar, pausar, reanudar y detener sesiones de trabajo
- **Gestión de Proyectos**: Crear y administrar múltiples proyectos
- **Cálculo de Ingresos**: Automático basado en tiempo y tarifa por hora
- **Sistema de Notas**: Agregar notas a cada sesión de trabajo
- **Estadísticas Avanzadas**: Métricas detalladas y proyecto más productivo
- **Persistencia en la Nube**: Datos sincronizados con Supabase
- **Moneda Argentina**: Pesos argentinos con formato local
- **Interfaz Moderna**: Diseño oscuro optimizado para desarrolladores

## 🚀 Despliegue

### Opción 1: Servidor Web (Recomendado)
1. Ejecuta `npm run build`
2. Sube la carpeta `dist` a tu servidor web
3. Configura las variables de entorno
4. ¡Listo!

### Opción 2: Vercel/Netlify
1. Conecta tu repositorio
2. Configura las variables de entorno
3. Despliegue automático

## 📋 Configuración de Supabase

### 1. Crear Proyecto
- Ve a [supabase.com](https://supabase.com)
- Crea un nuevo proyecto
- Guarda la URL y ANON KEY

### 2. Configurar Base de Datos
Ejecuta el SQL en el Editor SQL de Supabase:

```sql
-- Crear tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  total_time BIGINT DEFAULT 0,
  rate_per_hour DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de sesiones
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration BIGINT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices y políticas
CREATE INDEX idx_sessions_project_id ON sessions(project_id);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_projects_created_at ON projects(created_at);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON sessions FOR DELETE USING (true);
```

### 3. Variables de Entorno
Crea un archivo `.env` con:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📊 Funcionalidades

### Timer Principal
- **Iniciar**: Comienza a contar tiempo para un proyecto
- **Pausar**: Pausa el timer sin perder el tiempo
- **Reanudar**: Continúa desde donde se pausó
- **Terminar**: Guarda la sesión completa

### Gestión de Proyectos
- **Crear**: Nuevos proyectos con nombre, descripción y tarifa
- **Eliminar**: Proyectos con confirmación
- **Ver Sesiones**: Historial completo de cada proyecto
- **Agregar Notas**: Contexto para cada sesión

### Estadísticas
- **Tiempo Total**: Suma de todas las sesiones
- **Ingresos Totales**: Cálculo automático en pesos argentinos
- **Proyecto Más Productivo**: Destacado automáticamente
- **Métricas Promedio**: Por hora y por sesión

## 🎨 Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + CSS Variables
- **Estado**: Zustand
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: Heroicons
- **Notificaciones**: React Hot Toast
- **Fechas**: date-fns

## 📱 Responsive Design

- **Desktop**: Interfaz completa con todas las funciones
- **Tablet**: Layout adaptativo
- **Mobile**: Interfaz optimizada para pantallas pequeñas

## 🔒 Seguridad

- **Row Level Security**: Políticas de acceso configuradas
- **Variables de Entorno**: Credenciales seguras
- **Validación**: Inputs validados en frontend y backend

## 📈 Monitoreo

La aplicación incluye:
- **Error Handling**: Captura y muestra errores
- **Loading States**: Indicadores de carga
- **Toast Notifications**: Feedback inmediato
- **Console Logging**: Para debugging

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

**¡Disfruta controlando tu tiempo de programación!** ⚡
