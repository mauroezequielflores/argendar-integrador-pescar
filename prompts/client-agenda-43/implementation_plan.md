# Plan de Implementación: Lista de Ofertas (Cliente)

Esta implementación recreará la pantalla de "Ofertas recibidas" para una solicitud específica, siguiendo los lineamientos de la historia de usuario CA01 a CA06.

## User Review Required

- **Modalidad de presentación:** ¿Deseas que esta vista sea una página completa en `/client/agenda/:solicitud_id/offer-list` o prefieres que se maneje como un Modal grande sobre la pantalla actual? (Según la ruta `CA01`, asumiremos que es una página o una vista completa superpuesta/ruta dedicada).
- **Componente Rating:** Se creará o utilizará un componente genérico de "Estrellas" (Rating) en `components/ui/` para mostrar la calificación del profesional.

## Open Questions

- ¿La acción "Aceptar Oferta" debe navegar directamente a la ruta indicada en el CA05 o debe haber algún paso intermedio? Asumiré la navegación directa mediante `react-router-dom`.
- ¿El Header y Sidebar general de Cliente deben mostrarse en esta ruta o debe ser un Layout simplificado? Asumiremos usar el `ClientLayout` estándar que contiene Sidebar y Header superior, aunque en la imagen parece un panel autocontenido (quizás un modal).

## Proposed Changes

### `src/components/ui/`
- **`RatingSummary.jsx`**: (Si no está completo) Asegurar que el componente de calificación por estrellas coincida con el diseño (estrellas sólidas/vacías).
- **`Select.jsx`**: Reutilizar o ajustar el componente Select para el ordenamiento ("Ordenar por: todos").

### `src/features/agenda/`

#### [NEW] `data/mockClientOffers.js`
Datos de prueba estáticos de ofertas recibidas (avatar, nombre, calificación, categoría, precio, seña, mensaje, disponibilidad).

#### [NEW] `components/OfferCard.jsx`
Componente para la tarjeta individual de la oferta (CA02, CA03, CA05).

#### [NEW] `pages/OfferListPage.jsx`
Componente principal de la página que renderiza el título, el contador, el control de ordenamiento y el mapeo de `OfferCard` con funcionalidad de scroll (CA01, CA04, CA06).

### `src/app/router/`

#### [MODIFY] `AppRouter.jsx` / `routes.js`
Registrar la ruta `/client/agenda/:id/offer-list` apuntando a `OfferListPage`.

## Verification Plan

### Manual Verification
1. Navegar a `/client/agenda/123/offer-list`.
2. Verificar el diseño (fondo, espaciados, colores de tipografía y tarjetas) según la captura.
3. Comprobar que el scroll vertical funcione si se simulan múltiples ofertas.
4. Validar el funcionamiento visual de los botones "Ver Perfil Profesional" y "Aceptar Oferta".
5. Probar el componente `Select` de ordenamiento.
