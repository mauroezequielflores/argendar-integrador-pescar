import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { usePublicProfessionalProfile } from '../hooks/useProfileQueries';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import { ProfessionalProfileHeader, PublicProfileTab } from './ProfessionalProfilePage';

export default function ProfessionalPublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: profile, isLoading } = usePublicProfessionalProfile(id);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[500px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-white gap-4">
        <p className="text-xl">Error al cargar el perfil del profesional.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-[#F78736] hover:text-[#e06d00]">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-white p-2 md:p-6 max-w-5xl mx-auto w-full">
      <Button variant="ghost" onClick={() => navigate(-1)} className="self-start text-[#A8A8AA] hover:text-white px-0">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Volver
      </Button>

      <div className="flex flex-col gap-6">
        <ProfessionalProfileHeader profile={profile} isPublicView={true} />
        <PublicProfileTab profile={profile} />
      </div>
    </div>
  );
}
