# Walkthrough: Pantalla Privacidad

¡La pantalla de "Privacidad" (ruta `/client/profile/profile-privacy`) ha sido implementada exitosamente siguiendo la historia de usuario y las reglas de arquitectura!

## Cambios Realizados

### 1. Componente Reutilizable Genérico (`NavRow.jsx`)
Se creó el componente 100% reutilizable `NavRow.jsx` dentro de `src/components/ui/`, acatando la directiva de que los componentes sin lógica de negocio deben ubicarse allí.
- Renderiza el ícono en una caja oscura a la izquierda.
- Muestra título, subtítulo, y el chevron indicador a la derecha.
- Posee los estados hover (`hover:bg-[#3a3a3a]`) requeridos.

### 2. Ensamblado de `ProfilePrivacyPage.jsx`
La pantalla fue reconstruida para coincidir píxel a píxel con el mockup y la historia de usuario CA01-CA05.
- **Header y Breadcrumbs**: Uso del componente `Breadcrumbs` genérico.
- **Card principal**: Tarjeta padre englobando toda la vista.
- **Opciones de privacidad**:
  - Opción 1: "Administrar permisos" (con el ícono `IdentificationIcon` simulando la credencial).
  - Opción 2: "Configurar Cookies" (con el ícono `ViewColumnsIcon` emulando las tarjetas/cookies).
- **Footer**: Botones de "Volver" (con la flecha literal exigida en el CA) y "Cancelar", alineados respectivamente con Flexbox (`justify-between`) y navegando de regreso a `/client/profile`.

## Próximos Pasos
Puedes levantar la app en desarrollo mediante `npm run dev` y navegar a la ruta `/client/profile/profile-privacy` para probar la pantalla y verificar la funcionalidad de los botones (tanto de las tarjetas como los de abajo).
