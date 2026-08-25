# Plan de Implementación: Métodos de Pago

Implementaremos la pantalla "Métodos de pago" según la historia de usuario `payment-methods-userstory.md`, manteniendo fidelidad con la estructura global descrita en `prompt-recreacion-de-pantallas.md`.

## Proposed Changes

### 1. Componentes Existentes a Reutilizar
- **`Card.jsx`** (`src/components/ui/`): Envolverá la vista entera y el cuadro del estado vacío.
- **`Breadcrumbs.jsx`** (`src/components/ui/`): Rastro de navegación `Mi perfil > Métodos de pago`.
- **`EmptyState.jsx`** (`src/components/ui/`): Usaremos este componente genérico para renderizar la pantalla sin tarjetas ("No tienes tarjetas guardadas"). Le inyectaremos un ícono representativo (ej. `WalletIcon` o `CreditCardIcon`).
- **Botones inferiores (HTML raw)**: `<button>` con estilos idénticos al resto del módulo de perfil.

### 2. Implementación de Pantalla (`src/features/profile/pages/`)

#### [MODIFY/NEW] `PaymentMethodsPage.jsx`
- **Layout General**: `max-w-[1200px]` con espaciados responsive `p-4 md:p-6 lg:p-8`. Envuelto en un `Card` principal (`#202020`).
- **Cabecera**: Título "Métodos de pago" y descripción "Administrá tus métodos de pago guardados en la plataforma." con borde inferior.
- **Cuerpo Central**:
  - Contenedor interno con padding.
  - Título secundario: "Tarjetas guardadas:" seguido del subtítulo "Aquí recibirás el pago de tus servicios."
  - **Bloque Estado Vacío**: Contenedor bordeado (fondo `#292929`, `border-[#3a3a3a]`) que envolverá al componente `EmptyState` con ícono, título y texto.
  - **Acción Principal**: Un `<button className="w-full">` de color naranja (`bg-[#F78736]`) o estilo primario justo debajo del estado vacío, con el texto "Agregar una nueva Tarjeta".
- **Footer**: Bloque inferior con botones "Volver" (con flecha `<-`) y "Cancelar", navegando a `/client/profile`.

### 3. Actualización de Rutas (`src/app/router/`)
- La ruta `/client/profile/payment-methods` ya existe en `AppRouter.jsx` (línea 74 aprox.), solo debemos verificar que el componente se exporte y coincida correctamente.

## User Review Required
- Al usar `EmptyState.jsx` de forma genérica, este mostrará su layout en columna (ícono circular, texto blanco y subtítulo gris). Esto es óptimo y cumple la directiva de reusabilidad al 100%. Por favor, presiona Proceed si estás de acuerdo.

## Verification Plan
1. Iniciar servidor local (`npm run dev`).
2. Navegar a `Mi Perfil > Métodos de pago` desde el entorno local.
3. Validar los bordes, el componente `EmptyState` y la disposición de ancho completo (full-width) del botón de agregar tarjeta.
