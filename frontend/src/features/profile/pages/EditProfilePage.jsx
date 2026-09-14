import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CameraIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import InfoAlert from "../../../components/ui/InfoAlert";
import EmptyState from "../../../components/ui/EmptyState";
import RatingSummary from "../../../components/ui/RatingSummary";
import Loader from "../../../components/ui/Loader";
import { api } from "../../../libs/axios";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  
  // Base64 states for preview and upload
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [coverBase64, setCoverBase64] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/client/profile');
        setProfile(response.data);
        setBio(response.data.description || "");
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setAvatarBase64(base64);
    }
  };

  const handleSaveAndReturn = async () => {
    setIsSaving(true);
    try {
      const payload = { description: bio };
      if (avatarBase64) payload.avatarUrl = avatarBase64;
      if (coverBase64) payload.coverUrl = coverBase64; // Cover is currently not mapped to a distinct input, we'll map both just in case

      await api.patch('/client/profile', payload);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      navigate("/client/profile");
    } catch (error) {
      console.error("Error saving profile", error);
      setIsSaving(false);
    }
  };

  const handleSaveBio = async () => {
    setIsSaving(true);
    try {
      await api.patch('/client/profile', { description: bio });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving bio", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[500px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
      {/* ─── Header: Cover, Avatar y Botón ────────────────────────────── */}
      <div className="relative mb-24">
        {/* Cover Image */}
        <div 
          className="relative h-48 w-full rounded-t-xl bg-[#202020] border border-[#3a3a3a] overflow-hidden flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: coverBase64 ? `url(${coverBase64})` : (profile?.coverUrl ? `url(${profile.coverUrl})` : 'none') }}
        >
          {/* Note: Para que funcione la cámara de la portada, idealmente se necesita otra ref/input. Omitido por simplicidad si no hay input de cover, pero se deja el handler. */}
          <button
            onClick={() => {}} // TODO: Add a ref for cover input if needed
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a3a3a] text-white hover:bg-[#525252] transition-colors z-10"
            aria-label="Cambiar portada"
          >
            <CameraIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Input file oculto para el avatar */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />

        {/* Avatar, Textos y Botón (1/4 dentro del cover, 3/4 fuera) */}
        {/* Altura del avatar 100px -> -bottom-[75px] significa 75px fuera y 25px dentro */}
        <div className="absolute -bottom-[75px] left-0 w-full px-6 sm:px-8 flex items-end justify-between pointer-events-none">
          <div className="flex items-end gap-6 pointer-events-auto">
            <div className="relative">
              <div 
                className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-4 border-[#121212] bg-[#E5E7EB] overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: avatarBase64 ? `url(${avatarBase64})` : (profile?.avatarUrl ? `url(${profile.avatarUrl})` : 'none') }}
              >
                 {!avatarBase64 && !profile?.avatarUrl && <UserCircleIcon className="h-12 w-12 text-gray-400" />}
              </div>
              {/* Botón cámara de Avatar */}
              <button
                onClick={handleCameraClick}
                className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#3a3a3a] text-white opacity-90 hover:bg-[#525252] transition-colors"
                aria-label="Cambiar foto de perfil"
              >
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-2">
              <h1 className="text-[32px] font-bold text-white leading-none">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-sm text-[#A8A8AA] mt-1.5">
                {profile?.isVerified ? "Cliente verificado" : "Cliente no verificado"}
              </p>
            </div>
          </div>
          
          {/* Top-Right Botón "Guardar y volver a Mi perfil" reubicado debajo */}
          <div className="mb-2 pointer-events-auto hidden sm:block">
            <Button variant="secondary" onClick={handleSaveAndReturn} className="px-4">
              Guardar y volver a Mi perfil
            </Button>
          </div>
        </div>
      </div>
      
      {/* Botón en mobile si el espacio es reducido */}
      <div className="mt-8 sm:hidden px-4">
        <Button variant="secondary" onClick={handleSaveAndReturn} className="w-full">
          Guardar y volver a Mi perfil
        </Button>
      </div>

      {/* ─── Tabs: Editar perfil público ──────────────────────────────── */}
      <div className="mt-8 border-b border-[#3a3a3a] flex items-center gap-8">
        <div className="pb-3 text-sm font-medium border-b-2 border-[#F78736] text-[#FFFFFF]">
          <div className="flex items-center gap-2">
            <PencilSquareIcon className="w-5 h-5" />
            Editar perfil público
          </div>
        </div>
      </div>

      <div className="py-8 flex flex-col gap-6">
        {/* ─── Sección "Sobre mí" ───────────────────────────────────────── */}
        <Card className="p-6 border border-[#3a3a3a] bg-[#292929]">
          <h2 className="text-[24px] font-semibold text-white mb-4">Sobre mí</h2>
          <div className="flex flex-col items-end gap-3">
            <Textarea
              id="bio"
              label="Biografía personal"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={1000}
              placeholder="Contanos sobre vos..."
            />
            <div className="flex items-center gap-4">
              {isSuccess && (
                <span className="text-sm text-green-500 font-medium">¡Cambios guardados!</span>
              )}
              <div className="w-auto">
                <Button variant="primary" onClick={handleSaveBio} isLoading={isSaving} className="px-6">
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* ─── Aviso Informativo ────────────────────────────────────────── */}
        <InfoAlert>
          Las calificaciones no se pueden modificar. Si sentís que hay algún error comunicate con Soporte en{" "}
          <a href="mailto:soporte@argendar.com" className="underline hover:text-white transition-colors">
            soporte@argendar.com
          </a>{" "}
          ó navega a nuestra sección de{" "}
          <Link to="/client/help" className="underline hover:text-white transition-colors">
            Ayuda
          </Link>.
        </InfoAlert>

        {/* ─── Grilla de Calificaciones ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          
          {/* Resumen de Calificaciones */}
          <Card className="p-6 border border-[#3a3a3a] bg-[#292929] flex flex-col items-center">
            <h2 className="text-lg font-bold text-[#FFFFFF] mb-6 self-start">
              Resumen de Calificaciones
            </h2>
            <div className="w-full">
              <RatingSummary
                average={profile?.rating || 0}
                totalReviews={profile?.reviewsCount || 0}
                breakdown={{ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
              />
            </div>
          </Card>

          {/* Opiniones Recientes */}
          <Card className="p-6 border border-[#3a3a3a] bg-[#292929] flex flex-col">
            <h2 className="text-lg font-bold text-[#FFFFFF] mb-6">Opiniones recientes</h2>
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={SolidStarIcon}
                title="Aún no enviaste ninguna opinión"
                description="Tus opiniones a profesionales aparecerán aquí cuando comiences a calificar un servicio."
                action={
                  <div className="w-auto">
                    <Button variant="primary" onClick={() => navigate("/client/marketplace")} className="px-6">
                      Solicitar servicio
                    </Button>
                  </div>
                }
              />
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
