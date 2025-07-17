# Sistema de Canciones - Lyrics Player

## Descripción

Este sistema permite agregar, gestionar y reproducir canciones con letras sincronizadas por voces. Utiliza Supabase como base de datos para almacenar las canciones, voces y segmentos de texto.

## Características Implementadas

### ✅ Funcionalidad Principal

- **Agregar canciones**: Modal completo con título, letra y asignación de voces
- **Gestión de voces**: Crear voces personalizadas con nombres y colores
- **Asignación de texto**: Seleccionar partes del texto y asignarlas a voces específicas
- **Lista de canciones**: Mostrar todas las canciones guardadas con información básica
- **Eliminar canciones**: Remover canciones de la base de datos
- **Vista previa**: Mostrar cómo se verá la canción con los colores de voz

### ✅ Base de Datos

- **Conexión a Supabase**: Configurada y funcionando
- **Tabla songs**: Almacena título y letra de las canciones
- **Tabla voices**: Almacena las voces con nombre y color por canción
- **Tabla voice_segments**: Almacena los segmentos de texto asignados a cada voz

## Estructura de la Base de Datos

```sql
-- Tabla de canciones
CREATE TABLE songs (
  id     SERIAL PRIMARY KEY,
  title  VARCHAR(255) NOT NULL,
  lyrics TEXT         NOT NULL
);

-- Tabla de voces
CREATE TABLE voices (
  id      SERIAL PRIMARY KEY,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  name    VARCHAR(100) NOT NULL,
  color   CHAR(7)      NOT NULL
);

-- Tabla de segmentos de voz
CREATE TABLE voice_segments (
  id         SERIAL PRIMARY KEY,
  song_id    INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  voice_id   INTEGER NOT NULL REFERENCES voices(id) ON DELETE CASCADE,
  start_pos  INTEGER NOT NULL,
  end_pos    INTEGER NOT NULL,
  CHECK (start_pos < end_pos)
);
```

## Componentes Principales

### 1. `SongsManager`

Componente principal que combina toda la funcionalidad:

- Lista de canciones
- Botón para agregar nuevas canciones
- Modal para crear/editar canciones
- Manejo de estados de carga y errores

### 2. `AddSongModal`

Modal completo para agregar/editar canciones:

- **Pestaña "Información Básica"**: Título y letra
- **Pestaña "Voces"**: Crear voces y asignar texto
- **Pestaña "Vista Previa"**: Ver cómo se verá la canción

### 3. `SongsService`

Servicio para operaciones de base de datos:

- `saveSong()`: Guarda canción con voces y segmentos
- `getAllSongs()`: Obtiene todas las canciones
- `getSongWithVoices()`: Obtiene canción completa con datos
- `deleteSong()`: Elimina canción y datos relacionados

## Cómo Usar

### Para Agregar una Canción:

1. **Abrir el modal**: Hacer clic en "Añadir Canción"

2. **Información Básica**:

   - Escribir el título de la canción
   - Pegar la letra completa

3. **Configurar Voces**:

   - Crear las voces necesarias (ej: "Voz Principal", "Coro", "Rap")
   - Asignar colores a cada voz

4. **Asignar Texto**:

   - Volver a la pestaña "Información Básica"
   - Seleccionar partes del texto
   - Ir a "Voces" y hacer clic en "Asignar" junto a la voz deseada

5. **Vista Previa**:

   - Revisar cómo se verá la canción con los colores
   - Verificar que las asignaciones sean correctas

6. **Guardar**: Hacer clic en "Guardar Canción"

### Para Usar en tu Proyecto:

```tsx
import { SongsManager } from "@/components/SongsManager";

export default function MiPagina() {
  return <SongsManager />;
}
```

O usar componentes individuales:

```tsx
import { AddSongModal } from "@/components/modals/AddSongModal";
import { useAddSongModal } from "@/hooks/useAddSongModal";

export default function MiComponente() {
  const { isOpen, isLoading, error, openModal, closeModal, handleSave } =
    useAddSongModal();

  return (
    <div>
      <button onClick={openModal}>Añadir Canción</button>
      <AddSongModal isOpen={isOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
}
```

## Archivos Importantes

### Configuración

- `src/lib/supabase.ts`: Configuración de Supabase
- `src/lib/songsService.ts`: Servicio de base de datos

### Componentes

- `src/components/SongsManager.tsx`: Componente principal
- `src/components/modals/AddSongModal.tsx`: Modal para agregar canciones
- `src/components/SongsList.tsx`: Lista de canciones
- `src/components/ui/SongCard.tsx`: Tarjeta individual de canción

### Hooks

- `src/hooks/useAddSongModal.ts`: Hook para manejar el modal

### Tipos

- `src/types/song.ts`: Tipos TypeScript para canciones

## Estados y Manejo de Errores

El sistema maneja automáticamente:

- **Estados de carga**: Indicadores visuales durante operaciones
- **Manejo de errores**: Mensajes de error claros para el usuario
- **Validación**: Verificación de datos antes de guardar
- **Transacciones**: Rollback automático si falla alguna operación

## Próximos Pasos

Para continuar el desarrollo:

1. **Funcionalidad de Reproducción**: Implementar el reproductor de canciones
2. **Edición de Canciones**: Completar la funcionalidad de edición
3. **Búsqueda**: Agregar filtros y búsqueda de canciones
4. **Exportación**: Permitir exportar canciones en diferentes formatos
5. **Sincronización**: Agregar timing para sincronizar letra con audio

## Ejemplo de Uso Completo

```tsx
// Página principal
import { SongsManager } from "@/components/SongsManager";

export default function HomePage() {
  return <SongsManager />;
}
```

El sistema está completamente funcional y listo para usar. Todas las operaciones se conectan automáticamente con la base de datos de Supabase y manejan errores de manera robusta.
