# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comportamiento de Edición
- **Ediciones parciales:** No reescribas archivos completos. Modifica solo las líneas necesarias.
- **Sin explicaciones:** No expliques qué hiciste a menos que el usuario lo pida.
- **Concisión:** Respuestas breves. Prioriza el código sobre la prosa.
- **Modo Silencioso:** Si la edición fue exitosa, solo confirma con un "Hecho" o el diff.
- **Diseño: primero fluido, luego rápido.** Las animaciones deben sentirse limpias y suaves. Usa `SMOOTH = { type: "spring", stiffness: 260, damping: 26 }` para transiciones de layout. Para interacciones UI rápidas (botones, toggles) usa `stiffness: 500+` con `damping: 32+`. Nunca `mode="wait"` en `AnimatePresence` — usa `mode="popLayout"` para grillas o simplemente remueve el mode para transiciones instantáneas.

## Comandos del Proyecto
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Stack Técnico
- **Framework:** Next.js 16 App Router, React 19, TypeScript strict
- **Estilos:** Tailwind CSS v4 (sin tailwind.config — se configura vía PostCSS). No crear archivos CSS adicionales.
- **Iconos:** `lucide-react` exclusivamente
- **Animaciones:** `framer-motion`
- **Fechas:** `date-fns`
- **Clases CSS:** usar `cn()` de `src/lib/utils.ts` (clsx + tailwind-merge)

## Arquitectura

### Routing
El App Router agrupa las rutas protegidas bajo `src/app/(app)/`:
- `/login` — público
- `/(app)/layout.tsx` — layout protegido: verifica auth y guards de rol via `useEffect`
- `/(app)/logistics/*` — área logística (rol: `"logistica"`)
- `/(app)/asignar` — asignación de rutas (rol: `"logistica"`)
- `/(app)/chofer` — dashboard del chofer (rol: `"chofer"`)

### Autenticación
`src/lib/AuthContext.tsx` — contexto cliente con dos usuarios hardcodeados (`logistica/123`, `chofer/123`). El estado se persiste en `localStorage`. **Importante:** el estado inicial es siempre `null` y se carga en `useEffect` para evitar hydration mismatch SSR/cliente.

### Contextos Globales (src/lib/)
- `AuthContext` — usuario y rol activo
- `ThemeContext` — dark/light mode, persiste en localStorage
- `OrdersContext` — estado global de órdenes/pedidos

### Estructura de Features (src/features/)
Cada feature (`chofer/`, `logistics/`) sigue la misma estructura interna: `components/`, `hooks/`, `models/`, `services/`.

### Variables CSS de Tema
El tema usa CSS custom properties definidas en `globals.css`. Usar siempre estas variables en lugar de colores hardcodeados cuando aplique:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-color`
- `--radial-bg`

### Colores de Acento
Preferir colores sólidos, no transparentes/tenues:
- Azul: `#155DFC` (principal, interactivo)
- Verde: `#10B981` (disponible, confirmación)
- Ámbar: `#F59E0B` (advertencia, advertencia)
- Violeta: `#8B5CF6` (acento secundario)

### Colores de Avatares
Usar colores vibrantes y contrastantes en fondos oscuros:
```tsx
const AVATAR_COLORS = {
  CR: "#6366F1",  // Indigo
  MT: "#10B981",  // Verde
  JH: "#8B5CF6",  // Violeta
  RD: "#F59E0B",  // Ámbar
  AV: "#155DFC",  // Azul principal
  default: "#64748B"  // Gris slate
};
```
**Importante:** Siempre usar fondo sólido + texto blanco. Nunca usar colores con opacidad o semi-transparentes en avatares.

### Dropdowns y z-index
Los dropdowns deben usar `position: absolute` con `z-index` alto (ej. `z-[500]`) y el contenedor padre debe tener `overflow: visible` para que no se recorten.

### Animaciones de Layout
- **Cards con contenido variable (ej. formularios):** Usar `layout` en la card raíz + `layout="position"` en contenedores internos. Esto permite que framer-motion interpole cambios de altura automáticamente con spring suave.
- **Elementos que aparecen/desaparecen:** Envolver en `AnimatePresence` con `height: 0 → "auto"` en lugar de `opacity` solo. Usar `duration: 0.25-0.3` con easing `[0.25, 0.46, 0.45, 0.94]`.
- **Grillas con cards animadas:** Envolver con `LayoutGroup` para aislar animaciones por card. Usar `AnimatePresence mode="popLayout"` para exit suave.

### Microanimaciones
- **Botones:** `whileHover={{ scale: 1.01-1.02 }}` + `whileTap={{ scale: 0.94-0.97 }}` para feedback tacto.
- **Toggles/switches:** Spring con `stiffness: 400-500, damping: 28-30` para movimiento del track.
- **Valores animados (números, colores):** Usar `motion.span` o `motion.div` con `animate={{ color }}` + `transition={{ duration: 0.35 }}` para cambios suaves sin saltos.

### Reglas de Vibe Coding (Token Saving)
- **Ediciones Quirúrgicas:** Solo modifica las líneas de código necesarias. No reescribas el archivo completo a menos que sea un refactor total.
- **Sin Prosa:** No expliques los cambios ni saludes. Si la edición es exitosa, solo muestra el resultado o un "Hecho".
- **Preferencia de Estilos:** Usa siempre las variables de `globals.css` definidas arriba. No inventes colores hardcodeados.
- **Contexto Mínimo:** No leas archivos de la carpeta `node_modules` ni archivos de configuración a menos que te lo pida explícitamente.

### Contraste y Legibilidad
- **Texto sobre fondo oscuro:** Usar `--text-primary` (muy claro) para contenido principal. `--text-secondary` (gris claro) solo para labels/metadata. **Nunca** `--text-muted` para contenido interactivo.
- **Barra de combustible/progreso:** Animar el color junto con el ancho. Colores por rango: verde (>55%), ámbar (>25%), rojo (<25%).
- **Badges/estados:** Fondo sólido + texto blanco para máximo contraste. Ejemplo: `backgroundColor: "#10B981"`, `color: "#fff"`.

### Patrones Comunes

**Componentes Visuales (read-only):**
Cuando un componente solo muestra datos sin edición (ej. `GasBar`), pasar solo los valores necesarios. Ejemplo:
```tsx
<GasBar value={unit.gasolina} />  // no onChange, no editable flag
```

**Estados Condicionales con AnimatePresence:**
Para secciones que aparecen/desaparecen (ej. panel de mantenimiento en edit mode):
```tsx
<AnimatePresence initial={false}>
  {editMode && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ overflow: "hidden" }}
    >
      {/* contenido */}
    </motion.div>
  )}
</AnimatePresence>
```

**Transiciones de Valor (números, colores):**
```tsx
<motion.span animate={{ color }} transition={{ duration: 0.35 }}>
  {value}%
</motion.span>
```

**Barras de Progreso/Combustible:**
```tsx
<div className="relative h-2 rounded-full" style={{ backgroundColor: "var(--border-color)" }}>
  <motion.div
    className="absolute inset-y-0 left-0 rounded-full"
    animate={{ width: `${value}%`, backgroundColor: color }}
    transition={{ type: "spring", stiffness: 180, damping: 22 }}
  />
</div>
```