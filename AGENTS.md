# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

---

## Metodología de Trabajo Modular

**El proyecto sigue una arquitectura de orquestador + subcomponentes + hooks.** Cada `page.tsx` o componente principal es un orquestador ligero que delega lógica a hooks y delega JSX a subcomponentes.

### Regla de Tamaño
- **Límite duro: 400 líneas por archivo.** Si un archivo lo supera, dividirlo es prioridad antes de seguir trabajando en él.
- **Objetivo real:** pages ~75–200 L · componentes ~100–250 L · hooks ~40–80 L

### Patrón de Trabajo por Componente
Cuando se añade o modifica una funcionalidad:

1. **Identificar el componente responsable** — no hacer cambios dispersos en múltiples archivos de golpe.
2. **El estado va al hook, el JSX va al componente.** Si la lógica es reutilizable → `hooks/`. Si solo la usa un componente → puede quedar local en ese archivo.
3. **Los tipos van en `*.types.ts`** dentro de la carpeta del feature o ruta que los usa. No definir tipos inline en el componente si se comparten entre 2+ archivos.
4. **Datos mock y constantes grandes** van en `src/data/` o en el archivo de tipos del feature — nunca incrustados en el componente si ocupan más de 20 líneas.
5. **No crear helpers genéricos** para un solo uso. Tres líneas similares son mejores que una abstracción prematura.

### Cómo añadir algo nuevo a una página existente
```
1. Leer SOLO el hook de esa página (hooks/use*.ts) — ahí está el estado
2. Leer SOLO el componente relevante (components/*.tsx) — ahí está el JSX
3. Editar quirúrgicamente esos 2 archivos, no el page.tsx si no es necesario
4. Si el cambio añade >80 líneas al componente → extraer nuevo subcomponente
```

### Cómo crear una nueva página
```
src/app/(app)/nueva-ruta/
├── page.tsx                  # Orquestador: <100 líneas, solo imports + render
├── nueva-ruta.types.ts       # Interfaces y tipos compartidos
├── components/
│   ├── NombreCard.tsx        # Un componente visual por responsabilidad
│   └── NombreTable.tsx
└── hooks/
    └── useNombreState.ts     # Todo el useState/useMemo/useEffect
```

---

## Mapa de Archivos del Proyecto

> Usar este mapa antes de buscar con grep. Evita lecturas innecesarias.

### `src/lib/` — Contextos y utilidades globales
| Archivo | Qué contiene |
|---|---|
| `AuthContext.tsx` | Auth state, 4 usuarios hardcodeados, `useAuth()` hook |
| `ThemeContext.tsx` | Dark/light mode, persiste en localStorage |
| `OrdersContext.tsx` | Estado global de órdenes + `useOrders()` + `isReadyForRoute()` + tipos `Order`, `AnticipatedOrder`, `AnticipatedState` |
| `utils.ts` | `cn()` (clsx + tailwind-merge) |

### `src/components/` — Componentes UI reutilizables
| Archivo | Qué contiene |
|---|---|
| `layout/Sidebar.tsx` | Sidebar principal, `NAV_ITEMS`, lógica de ruta activa, `matchPrefix` |
| `ui/MiniCalendar.tsx` | Date picker reutilizable. Props: `{ id, selectedDate, onDateChange }` |

### `src/data/` — Mock data y constantes grandes
Datos de prueba compartidos entre rutas (MOCK_ORDERS, bloques, choferes, etc.).

### `src/app/(app)/` — Rutas protegidas

#### `layout.tsx`
Auth guard + guards de rol via `useEffect`. Redirige según `user.role`.

#### `logistics/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Tabla principal de pedidos logística. Usa `LogisticsFiltersPanel` + `LogisticsTable` + `AsignarOrdenesTable` |
| `anticipados/page.tsx` | Tabla de pedidos anticipados. Usa `AnticipatedOrdersTable` |

#### `asignar/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Orquestador (~160 L). Usa `useOrderFiltering` + `useToastManager` |
| `asignar.types.ts` | `AssignState`, `SortKey`, `ViewMode`, `FilterState`, `Driver`, `Block`, `InvoiceOrder`, `ToastData` |
| `components/OrderAssignmentCard.tsx` | Card completa de orden con dropdown selector de chofer + `DriverOption` |
| `components/SuccessToast.tsx` | `Toast` + `ToastContainer` con auto-dismiss 3200ms |
| `hooks/useOrderFiltering.ts` | `search`, `filterState`, `viewMode`, `filtered`, `counts`, `handleAssign` |
| `hooks/useToastManager.ts` | `toasts[]`, `toastCounter` ref, `handleToast`, `dismissToast` |

#### `autorizar/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Orquestador (~130 L). Grilla de choferes + `ScanModal` |
| `components/ScanModal.tsx` | Modal completo: header, tabs, lista facturas, botón autorizar |
| `components/AuthDriverCard.tsx` | Card individual de chofer con badge de autorización |
| `hooks/useScanModal.ts` | `scannedCodes`, `currentCode`, `inputMode`, `scanResult`, `error`, `confirming`, `inputRef` |
| `hooks/useAuthorizationManager.ts` | `authorizedDrivers` Set, `handleOpenScan`, `handleScanComplete` |

#### `caja/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Orquestador (~55 L). Usa `useCaja()` + 3 paneles |
| `components/CajaChoferPanel.tsx` | Sidebar: filtro pendiente/entregado + lista de choferes |
| `components/CajaPedidosTable.tsx` | Info card del chofer seleccionado + tabla de pedidos + cancelación |
| `components/CajaSummaryActions.tsx` | Total + botón Marcar Entregado + flujo de revert |

Hook central en `src/features/caja/hooks/useCaja.ts` — **NO** en `src/app/(app)/caja/`.

#### `chofer/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Dashboard del chofer. Usa `ChoferClientInfoCard` + `ChoferItemsTable` |

#### `supervision/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Orquestador (~75 L). Usa `useOrdersFilterPaginate` + 3 componentes |
| `supervision.types.ts` | `OrderStatus`, `DriverStatus`, `FilterStatus`, `Order`, `Driver`, `DriverSummary` |
| `components/OrderStatusStats.tsx` | 4 stat cards animadas (total, pendiente, enRuta, entregado) |
| `components/DriversHorizontalList.tsx` | Carrusel horizontal de cards de choferes con scroll indicator |
| `components/OrdersTable.tsx` | Tabla paginada + toolbar (search, status dropdown, MiniCalendar) |
| `components/PaginationControls.tsx` | Controles reutilizables. Retorna `null` si `totalPages <= 1` |
| `hooks/useOrdersFilterPaginate.ts` | `search`, `filterStatus`, `selectedDate`, `page`, `stats`, `driversSummary`, `filtered`, `paginated`. Exporta `PAGE_SIZE = 8` |

#### `supervision/choferes/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Historial de chofer. Recibe `?chofer=XX` via `useSearchParams` |
| `components/DriverHistoryHeader.tsx` | Botón atrás + avatar + nombre + stats rápidas |
| `components/DeliveryStatusCards.tsx` | 3 stat cards (Entregados/En Ruta/Pendientes) |
| `components/HourlyActivityChart.tsx` | Gráfico de barras recharts por hora (8h–18h) |
| `components/ZoneDistributionPanel.tsx` | Top 5 zonas con barras animadas |
| `components/DeliveriesTable.tsx` | Tabla paginada de entregas + toolbar de filtros |
| `components/DeliveryDetailModal.tsx` | Modal de detalle por entrega con lista de items |

#### `unidades/`
| Archivo | Qué contiene |
|---|---|
| `page.tsx` | Orquestador (~140 L). `INITIAL_UNITS`, `FILTERS`, grilla de `UnitCard` |
| `unidades.types.ts` | `UnitStatus`, `StatusFilter`, `Driver`, `Unit` |
| `components/UnitCard.tsx` | Card con dropdown chofer + barra gas + toggle mantenimiento |
| `components/GasBar.tsx` | Barra combustible animada. Props: `{ value: number }` |
| `components/DriverSelectOption.tsx` | Opción dropdown. Exporta `AVATAR` y `av()` para uso en `UnitCard` |
| `hooks/useUnitCard.ts` | `pendingId`, `open`, `editMode`, `localMaint`, `ref`, `handleSave`, `handleEditSave`, `handleEditCancel` |

### `src/features/chofer/` — Feature del chofer
| Archivo | Qué contiene |
|---|---|
| `components/ChoferClientInfoCard.tsx` | Card info del cliente activo |
| `components/ChoferItemsTable.tsx` | Orquestador (~180 L). Lista `WarehouseCard` por almacén |
| `components/warehouse/AluminioMap.tsx` | SVG memoizado del almacén aluminio |
| `components/warehouse/VidrioMap.tsx` | SVG del almacén vidrio |
| `components/warehouse/LocationModal.tsx` | Portal modal con mapa + secciones activas |
| `components/items/ItemRow.tsx` | Fila checkbox con peso + badges |
| `components/items/WarehouseCard.tsx` | Card por almacén con save + mapa |
| `components/modals/ReportMissingModal.tsx` | Modal de reporte de faltantes |
| `hooks/useVerificationState.ts` | `savedVerified`, `reportedItems`, sessionStorage, `handleCommit` |
| `models/chofer.types.ts` | Tipos del feature chofer |
| `services/chofer.api.ts` | Llamadas API del chofer |

### `src/features/logistics/` — Feature de logística
| Archivo | Qué contiene |
|---|---|
| `components/AsignarOrdenesTable.tsx` | Orquestador (~200 L). Usa `useAssignmentFiltering` + `BlockSelector` + `AssignmentSummaryCards` |
| `components/AnticipatedOrdersTable.tsx` | Orquestador (~200 L). Usa `useAnticipatedFiltering` + `AnticipatedFilterRow` |
| `components/LogisticsTable.tsx` | Tabla principal de pedidos de logística |
| `components/LogisticsFiltersPanel.tsx` | Panel de filtros de logística |
| `components/LogisticsLegend.tsx` | Leyenda de estados |
| `components/StateIndicator.tsx` | Semáforo de estado visual |
| `components/OverallBadge.tsx` | Badge de estado general |
| `components/asignar/asignar.types.ts` | `AssignState`, `FilterState`, `Driver`, `Block`, `LocalAssignment` |
| `components/asignar/BlockSelector.tsx` | Dropdown 2-pasos bloque→chofer. **Exporta `BLOCKS`** (datos de 4 bloques) |
| `components/asignar/AssignmentSummaryCards.tsx` | 3 stat cards: Listos/Asignados/Pendientes |
| `components/anticipated/AnticipatedFilterRow.tsx` | Pills de filtro + search + MiniCalendar |
| `hooks/useLogisticsQuery.ts` | Query de órdenes logística |
| `hooks/useLogisticsPageState.ts` | Estado de la página de logística |
| `hooks/useAssignmentFiltering.ts` | `assignments`, `stateFilter`, `blockFilter`, `filtered`, `pendingCount`, `assignedCount`, `enRutaCount` |
| `hooks/useAnticipatedFiltering.ts` | `search`, `bucket`, `selectedDate`, `currentPage`, `filtered`, `paginated`, `totalPages`. Exporta `FilterBucket` type |
| `models/logistics.types.ts` | Tipos del feature logística |
| `models/filters.types.ts` | Tipos de filtros |
| `services/logistics.api.ts` | Llamadas API logística |

### `src/features/caja/`
| Archivo | Qué contiene |
|---|---|
| `hooks/useCaja.ts` | Hook central de caja. Interfaces `Chofer`, `Pedido`. Maneja `selectedId`, `choferes`, `pedidos`, `cancelarPedido`, `marcarEntregado`, `revertirEntregado` |

---

## Arquitectura

### Routing
El App Router agrupa las rutas protegidas bajo `src/app/(app)/`:
- `/login` — público
- `/(app)/layout.tsx` — layout protegido: verifica auth y guards de rol via `useEffect`
- `/(app)/logistics/*` — área logística (rol: `"logistica"`)
- `/(app)/asignar` — asignación de rutas (rol: `"logistica"`)
- `/(app)/chofer` — dashboard del chofer (rol: `"chofer"`)
- `/(app)/autorizar` — autorización de salida (roles: `"logistica"`, `"guardia"`)
- `/(app)/supervision` — panel de supervisión (rol: `"admin"`)
- `/(app)/supervision/choferes` — historial por chofer, recibe `?chofer=XX` via `useSearchParams`
- `/(app)/caja` — gestión de caja (rol: `"logistica"`)
- `/(app)/unidades` — control de unidades (rol: `"logistica"`)

### Navegación con Parámetros
```tsx
router.push(`/supervision/choferes?chofer=${initials}`)
const choferParam = useSearchParams().get("chofer")
```

### Autenticación
`src/lib/AuthContext.tsx` — contexto cliente con 4 usuarios hardcodeados. El estado inicial es siempre `null` (carga en `useEffect` para evitar hydration mismatch).

| Usuario | Rol | Redirige a |
|---|---|---|
| `logistica/123` | `"logistica"` | `/logistics` |
| `chofer/123` | `"chofer"` | `/chofer` |
| `guardia/123` | `"guardia"` | `/autorizar` |
| `admin/123` | `"admin"` | `/supervision` |

La cadena de redirección se implementa en **4 lugares**: `layout.tsx`, `login/page.tsx` (useEffect ya-autenticado), `login/page.tsx` (setTimeout post-login) y `app/page.tsx`.

### Variables CSS de Tema
Definidas en `globals.css`. Usar siempre estas variables:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-color`, `--border-hover`
- `--accent`, `--accent-bg`, `--accent-border`
- `--table-header-bg`, `--table-row-bg`, `--table-row-hover`
- `--dropdown-bg`, `--dropdown-shadow`
- `--footer-bg`, `--bg-input`
- `--select-option-hover`

### Colores de Acento
**PROHIBIDO:** `linear-gradient` con colores semi-transparentes como fondo de cards. Siempre fondos sólidos `var(--bg-*)`.

- Azul: `#155DFC` (principal, interactivo)
- Verde: `#10B981` (éxito, disponible)
- Ámbar: `#F59E0B` (advertencia, mantenimiento)
- Violeta: `#8B5CF6` (acento secundario)

### Colores de Avatares
```tsx
const AVATAR_COLORS = {
  CR: "#6366F1",  MS: "#10B981",  EV: "#155DFC",
  JH: "#8B5CF6",  RD: "#F59E0B",  MT: "#0EA5E9",
  default: "#64748B"
};
```
Siempre fondo sólido + texto blanco. Nunca opacidad en avatares.

### Dropdowns y z-index
`position: absolute`, `z-[500]`, contenedor padre con `overflow: visible`.

---

## 🛡️ Protocolo de Ahorro de Tokens (Anti-Overread)

- **Prohibido el Full-Read** en archivos >400 líneas. Usa `grep` primero para localizar, luego lee solo el rango necesario.
- **Usar el Mapa de Archivos** arriba antes de buscar con grep. Si el archivo está mapeado, ya sabes qué contiene.
- **Planificación por Líneas:** Antes de editar, identifica el rango exacto de líneas a modificar.
- **Salida Minimalista:** Solo el bloque afectado. No reescribir el archivo si el cambio es <15% del contenido.
- **Modularización Preventiva:** Archivo >400 L → proponer y ejecutar división antes de seguir.
- **Memoria de Turno:** No releer un archivo ya leído en el turno actual salvo cambio externo confirmado.
- **Sin Prosa:** Solo código. "Hecho" si la edición fue exitosa.

---

## Animaciones

### Constantes
```tsx
const SMOOTH = { type: "spring", stiffness: 260, damping: 26 }  // layout transitions
// Botones/toggles rápidos: stiffness: 400-500, damping: 28-32
```

### Patrones
```tsx
// Sección que aparece/desaparece
<AnimatePresence initial={false}>
  {visible && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ overflow: "hidden" }}
    />
  )}
</AnimatePresence>

// Cards con altura variable
<motion.div layout transition={SMOOTH}>          // raíz
  <motion.div layout="position" transition={SMOOTH}>  // interior

// Grilla con exit animado
<LayoutGroup>
  <AnimatePresence mode="popLayout">
    {items.map(item => <Card key={item.id} />)}
  </AnimatePresence>
</LayoutGroup>

// Valor/color animado
<motion.span animate={{ color }} transition={{ duration: 0.35 }}>

// Barra de progreso
<motion.div animate={{ width: `${v}%`, backgroundColor: color }}
  transition={{ type: "spring", stiffness: 180, damping: 22 }} />
```

---

## Design System

### Tipografía
| Uso | Clase |
|---|---|
| Título de página | `text-2xl md:text-3xl font-extrabold tracking-tight` |
| Subtítulo | `text-xs` + `color: var(--text-secondary)` |
| Número stat | `text-4xl font-extrabold tabular-nums` |
| Label stat | `text-[10px] font-bold uppercase tracking-widest` |
| Texto tabla | `text-sm font-semibold` + `color: var(--text-primary)` |
| Metadata | `text-xs` + `color: var(--text-secondary)` |

### Colores de Texto — Regla estricta
- `var(--text-primary)` → contenido principal: nombres, valores, folios
- `var(--text-secondary)` → metadata, labels, subtítulos
- `var(--text-muted)` → **solo** placeholders, iconos decorativos, timestamps secundarios
- **Prohibido:** grises hardcodeados (`#64748B`, `gray-*`) en texto visible
- **Prohibido:** `#155DFC` en texto corrido — solo botones, badges activos, iconos interactivos

### Estructura de Página Estándar
1. **Header** — icono gradient azul `w-11 h-11 rounded-2xl` + título `font-extrabold` + subtítulo con métrica dinámica
2. **Filtros** — fila horizontal, `py-2.5` uniforme
3. **Stats** — grid 3–4 cards con número grande + label uppercase
4. **Contenido** — grid `lg:grid-cols-3`, contenido `col-span-2`, sidebar 1 col
5. **Cards/filas** — `var(--bg-secondary)` + `var(--border-color)` + `rounded-2xl`/`rounded-3xl`

### Header de Página
```tsx
<div className="flex items-center gap-3.5">
  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
    style={{ background: "linear-gradient(135deg,#155DFC,#2563EB)", boxShadow: "0 0 20px rgba(21,93,252,0.28)" }}>
    <Icon className="w-5 h-5 text-white" />
  </div>
  <div>
    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
      Título
    </h1>
    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>métrica dinámica</p>
  </div>
</div>
```

### Badges
- **En tabla (read-only):** fondo `rgba(color, 0.12)` + borde `rgba(color, 0.35)` + texto color sólido
- **En cards interactivos:** fondo sólido + texto blanco

### Tablas
**Nunca `divide-y` con `borderColor` inline** — produce líneas blancas en dark mode. Usar:
```tsx
style={{ borderBottom: isLast ? "none" : "1px solid var(--border-color)" }}
```

### Tablas Responsivas
```tsx
{/* Desktop */}
<div className="hidden md:block w-full overflow-x-auto">
  <div className="min-w-[860px]">{/* grid header + rows */}</div>
</div>
{/* Mobile */}
<div className="md:hidden">
  {items.map(item => (
    <div className="px-4 py-3.5 flex flex-col gap-2.5"
      style={{ borderBottom: "1px solid var(--border-color)" }}>
    </div>
  ))}
</div>
```

### Botones de Acción en Tabla
```tsx
<motion.button
  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
  transition={{ type: "spring", stiffness: 350, damping: 28 }}
  className="p-2 rounded-xl border"
  onMouseEnter={e => { e.currentTarget.style.color = "#155DFC"; e.currentTarget.style.borderColor = "#155DFC"; e.currentTarget.style.backgroundColor = "rgba(21,93,252,0.08)"; }}
  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
>
  <Eye className="w-4 h-4" />
</motion.button>
```

### Componente MiniCalendar
```tsx
<MiniCalendar
  id="id-unico"
  selectedDate={selectedDate}
  onDateChange={(d) => { setSelectedDate(d); setPage(1); }}
/>
```
- Posicionado con `fixed` dinámico — no necesita `z-index` en el padre.
- Clickear el mismo día la deselecciona. Muestra X para limpiar cuando hay fecha seleccionada.

### Filtro por Fecha con Strings formateados
```tsx
// deliveryDate = "19 Oct, 14:30" — NO usar new Date(string)
const label = selectedDate.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  .replace(".", "").toLowerCase();
matchDate = o.deliveryDate.toLowerCase().startsWith(label);
```

### Sidebar NAV_ITEMS
- Iconos inactivos: `color: "#155DFC"` — nunca gris
- Iconos activos: `color: "#FFFFFF"`
- Rutas padre activas en subrutas: usar `matchPrefix`



  ## Ejecución
  - **Nunca pedir confirmación** para cambios que el usuario claramente solicitó.
  - **Nunca hacer preguntas aclaratorias** — inferir la intención y ejecutar. Si hay ambigüedad, elegir la interpretación más razonable y avisar en una línea máximo.
  - **Nunca repetir** lo que el usuario pidió antes de ejecutar.
  - **Nunca sugerir alternativas** a menos que el enfoque solicitado sea técnicamente inviable.
  - **Sin frases intro:** No usar "Voy a...", "Primero voy a leer...", "Entendido, procedo a...".

  2. Manejo de errores

  ## Errores y Debugging
  - Si un edit falla, diagnosticar y corregir en el mismo turno sin anunciar el intento fallido.
  - Si TypeScript lanza error en el cambio realizado, corregirlo directamente sin preguntar.
  - No mostrar stack traces completos — solo la línea relevante + fix aplicado.

  3. Creación de archivos

  ## Creación de Archivos
  - Nunca crear archivos nuevos sin que el usuario lo pida explícitamente.
  - Si el cambio cabe en un archivo existente, usarlo.
  - Nunca crear archivos de documentación, README, ni comentarios explicativos en el código.

  4. Prohibición de relleno

  ## Prohibiciones Absolutas
  - Sin emojis.
  - Sin listas de "próximos pasos" al final de una respuesta.
  - Sin "Recuerda que...", "Ten en cuenta que...", "Nota:".
  - Sin comentarios en código que expliquen lo obvio.
  - Sin `console.log` de debug al entregar código.
  
  ## Silencio Total en Ejecución
  - Prohibido narrar lo que se está leyendo: nunca "Ahora leo...", "Leo el archivo...", "Voy a revisar...".
  - Prohibido anunciar diagnósticos antes de ejecutar. Si hay análisis, hacerlo internamente.
  - Prohibido listar causas del problema antes de corregirlo — solo aplicar el fix.
  - Prohibido escribir "Tengo todo el contexto" o frases similares de confirmación.
  - El único output permitido antes del código es UNA línea si hay ambigüedad crítica.
  - Después del código: solo "Hecho" o el diff. Sin resumen de qué se cambió ni por qué.

  ## Diseño Frontend
  - Nunca usar Inter, Roboto, Arial ni System fonts.
  - Siempre elegir una dirección estética clara antes de codear.
  - Layouts asimétricos por defecto — romper el grid cuando tenga sentido.
  - Animaciones de entrada escalonadas en cada página nueva.
  - El diseño debe sentirse diseñado, no generado.