# Edit Profile Screen Implementation

Implementar la pantalla de "Editar perfil público" basándonos en la user story `edit-profile-userstory.md` y las capturas adjuntas, promoviendo la creación de componentes reutilizables de UI.

## Proposed Changes

### Componentes Reutilizables (src/components/ui/)

#### [NEW] `Textarea.jsx`
- Componente de texto multilínea que sigue la misma estética de `Input.jsx`.
- Soportará la propiedad `maxLength` e incluirá de manera opcional un contador dinámico de caracteres en la esquina inferior derecha.

#### [NEW] `InfoAlert.jsx`
- Bloque de alerta genérico.
- Contendrá un ícono (como "i" de información) y texto descriptivo, permitiendo renderizar links u otros nodos en su contenido.

#### [NEW] `ProgressBar.jsx`
- Componente visual simple para mostrar una barra de progreso horizontal. Será utilizado para el desglose de calificaciones.

#### [NEW] `RatingSummary.jsx` (o en components compartidos)
- Componente de solo lectura que encapsula la lógica de mostrar el promedio de puntuación, las 5 estrellas visuales y el desglose (barras de 5 a 1).

### Pantalla (src/features/profile/)

#### [MODIFY] `pages/EditProfilePage.jsx`
- Implementar el diseño final:
  - **Header Editable**: Imagen de portada oscura y Avatar, ambos con botón superpuesto de "cámara".
  - **Botón Superior**: "Guardar y volver a Mi perfil" (fijo a la derecha).
  - **Tabs**: Pestaña activa "Editar perfil público" (con ícono de lápiz).
  - **Biografía**: Tarjeta "Sobre mí" utilizando el nuevo `Textarea` y un botón "Guardar cambios".
  - **Aviso Informativo**: Utilizando `InfoAlert`.
  - **Grilla de Calificaciones**: Layout de 2 columnas. Columna 1 con `RatingSummary` y Columna 2 con el estado vacío ("Opiniones recientes") usando el componente `EmptyState` existente.

## User Review Required

- ¿Deseas que los botones de "Cámara" para cambiar la imagen simulen actualizar la foto usando un estado local en esta demostración, o solo abran el selector de archivos?

## Verification Plan
1. Ejecutar el proyecto en modo de desarrollo (`npm run dev`).
2. Navegar al flujo del cliente y hacer clic en el botón para editar el perfil público, llevando a `/client/profile/edit-profile`.
3. Verificar visualmente todos los Criterios de Aceptación (CA01 a CA06).
