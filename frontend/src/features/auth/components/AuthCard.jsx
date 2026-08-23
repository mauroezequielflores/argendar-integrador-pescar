/**
 * AuthCard — Tarjeta dividida para pantallas de autenticación.
 *
 * Estructura:
 *  ┌─────────────────────┬─────────────────────┐
 *  │   Panel izquierdo   │   Panel derecho      │
 *  │   (formulario)      │   (imagen + overlay) │
 *  └─────────────────────┴─────────────────────┘
 *
 * En mobile: solo muestra el panel izquierdo.
 */
export default function AuthCard({ leftPanel, rightImage, rightOverlayText }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#292929] p-4">
      <div className="flex w-full max-w-[760px] overflow-hidden rounded-[20px] shadow-2xl">
        {/* Panel izquierdo — Formulario */}
        <div className="flex w-full flex-col justify-center bg-[#202020] px-10 pt-25 py-12 md:w-[52%]">
          {leftPanel}
        </div>

        {/* Panel derecho — Imagen decorativa (oculto en mobile) */}
        <div className="relative hidden md:block md:w-[48%]">
          {rightImage && (
            <img
              src={rightImage}
              alt="Argendar — servicios profesionales"
              className="h-full w-full object-cover"
            />
          )}
          {/* Overlay degradado */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Texto sobre imagen */}
          {rightOverlayText && (
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-center text-sm font-medium leading-relaxed text-white">
                {rightOverlayText}
              </p>
              {/* Slider dots decorativos */}
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/90" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
