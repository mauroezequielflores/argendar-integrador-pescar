import { useNavigate } from "react-router-dom";
import { UserCircleIcon, ShieldCheckIcon, CreditCardIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ProfileInfoTab() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Configurar Perfil",
      description: "Datos personales de tu cuenta.",
      icon: UserCircleIcon,
      path: "/client/profile/profile-settings"
    },
    {
      title: "Privacidad",
      description: "Preferencias y control sobre el uso de tus datos.",
      icon: ShieldCheckIcon,
      path: "/client/profile/profile-privacy"
    },
    {
      title: "Métodos de pago",
      description: "Administrá tus métodos de pago guardados en la plataforma.",
      icon: CreditCardIcon,
      path: "/client/profile/payment-methods"
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => navigate(opt.path)}
          className="group flex flex-col items-start bg-[#292929] border border-[#3a3a3a] rounded-[6px] p-6 hover:bg-[#323232] transition-colors text-left"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center gap-3 text-[#FFFFFF]">
              <opt.icon className="h-5 w-5 text-[#A8A8AA]" />
              <h3 className="font-bold">{opt.title}</h3>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-[#A8A8AA] group-hover:text-[#FFFFFF] transition-colors" />
          </div>
          <p className="text-sm text-[#A8A8AA] ml-8">
            {opt.description}
          </p>
        </button>
      ))}
    </div>
  );
}
