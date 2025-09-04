# Configuración de Producción - Timer App

## Variables de Entorno Requeridas

### Supabase
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase

## Estructura de Base de Datos

### Tabla: projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  total_time BIGINT DEFAULT 0,
  rate_per_hour DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration BIGINT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Índices y Políticas
```sql
-- Índices para rendimiento
CREATE INDEX idx_sessions_project_id ON sessions(project_id);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON sessions FOR DELETE USING (true);
```

## Comandos de Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Construcción para Producción
```bash
npm run build
```

### Vista Previa de Producción
```bash
npm run preview
```

## Opciones de Despliegue

### 1. Servidor Web
- Sube la carpeta `dist` a tu servidor
- Configura variables de entorno
- Usa `.htaccess` para Apache

### 2. Vercel/Netlify
- Conecta repositorio
- Configura variables de entorno
- Despliegue automático

## Checklist de Producción

- [ ] Variables de entorno configuradas
- [ ] Base de datos Supabase configurada
- [ ] Tablas y políticas creadas
- [ ] Build exitoso sin errores
- [ ] Pruebas de funcionalidad completadas
- [ ] Dominio configurado (opcional)
- [ ] SSL habilitado
- [ ] Monitoreo configurado (opcional)
