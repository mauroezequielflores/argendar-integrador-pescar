import { useState } from "react";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import ProfileHeader from "../components/ProfileHeader";
import PublicProfileTab from "../components/PublicProfileTab";
import ProfileInfoTab from "../components/ProfileInfoTab";
import Loader from "../../../components/ui/Loader";
import { useClientProfile } from "../hooks/useProfileQueries";

/**
 * ProfilePage — Pantalla principal de Mi Perfil (Cliente).
 * Ruta: /client/profile
 */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("public"); // "public" | "info"

  const { data: profile, isLoading } = useClientProfile();

  const breadcrumbs = [
    { label: "Mi cuenta", href: "/client/profile" },
    { label: "Perfil" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[500px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-white text-center mt-10">Error al cargar perfil.</div>;
  }

  return (
    <div className="flex flex-col gap-6 text-white font-sans w-full">
      {/* ── Breadcrumb de navegación (CA01) ─────────────────────────── */}
      <Breadcrumbs items={breadcrumbs} />

      {/* ── Encabezado del Perfil (CA01, CA02) ──────────────────────── */}
      <ProfileHeader profile={profile} />

      {/* ── Pestañas de Navegación ──────────────────────────────────── */}
      <div className="border-b border-[#323232] flex items-center gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("public")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === "public"
              ? "border-[#F78736] text-white"
              : "border-transparent text-[#A8A8AA] hover:text-white"
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span>Perfil público</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === "info"
              ? "border-[#F78736] text-white"
              : "border-transparent text-[#A8A8AA] hover:text-white"
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span>Información de perfil</span>
        </button>
      </div>

      {/* ── Contenido de la Pestaña Activa ──────────────────────────── */}
      <div className="pb-10">
        {activeTab === "public" ? (
          <PublicProfileTab profile={profile} />
        ) : (
          <ProfileInfoTab />
        )}
      </div>
    </div>
  );
}
