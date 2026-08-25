/**
 * AuthDivider — Separador horizontal con punto circular central según diseño Argendar.
 */
export default function AuthDivider({ className = "" }) {
  return (
    <div className={`relative my-6 flex items-center justify-center ${className}`}>
      <div className="w-full border-t border-[#3a3a3a]" />
      <div className="absolute flex items-center justify-center bg-[#202020] px-2.5">
        <span className="h-1.5 w-1.5 rounded-full border border-[#808080] bg-transparent" />
      </div>
    </div>
  );
}