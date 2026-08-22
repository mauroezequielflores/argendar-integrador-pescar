import { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PublicProfileTab from "../components/PublicProfileTab";
import ProfileInfoTab from "../components/ProfileInfoTab";
import { mockProfile } from "../data/mockProfile";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("public"); // "public" or "info"

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
      {/* Opcional: una card oscura de fondo si queremos seguir un layout exacto. Según el diseño, parece el propio background del main area, así que lo pondremos sobre él */}
      
      {/* Header */}
      <ProfileHeader profile={mockProfile} />

      {/* Tabs */}
      <div className="mt-8 border-b border-[#3a3a3a] flex items-center gap-8">
        <button
          onClick={() => setActiveTab("public")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "public"
              ? "border-[#F78736] text-[#FFFFFF]"
              : "border-transparent text-[#A8A8AA] hover:text-[#FFFFFF]"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Perfil público
          </div>
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "info"
              ? "border-[#F78736] text-[#FFFFFF]"
              : "border-transparent text-[#A8A8AA] hover:text-[#FFFFFF]"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Información de perfil
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pb-16">
        {activeTab === "public" ? (
          <PublicProfileTab profile={mockProfile} />
        ) : (
          <ProfileInfoTab />
        )}
      </div>
    </div>
  );
}
