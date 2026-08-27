import { BellIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../../../components/ui/NotificationCard";

export default function NotificationDropdown({ notifications, onClose, onViewAll, onRead }) {
    const navigate = useNavigate();

    return (
        <div className="absolute right-0 mt-2 w-[321px] overflow-hidden rounded-[4px] border border-[#323232] bg-[#292929] shadow-lg z-50">
            <div className="flex h-12 items-center justify-center border-b border-[#3a3a3a] bg-[#202020]">
                <h3 className="text-sm font-medium text-white">Notificaciones</h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            title={notification.titulo}
                            description={notification.descripcion}
                            time={notification.fecha}
                            icon={notification.icon}
                            iconBgColor={notification.iconBgColor}
                            iconColor={notification.iconColor}
                            isNew={notification.isNew}
                            compact
                            onClick={() => {
                                onClose();
                                onRead?.(notification.id);
                                navigate(notification.href || "#");
                            }}
                        />
                    ))
                ) : (
                    <div className="flex min-h-[308px] flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#323232]">
                            <BellIcon className="h-6 w-6 text-[#A8A8AA]" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-sm font-bold text-white">No tenés notificaciones</h4>
                        <p className="mt-2 max-w-[220px] text-xs leading-4 text-[#A8A8AA]">
                            Te avisaremos cuando ocurra algo importante.
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t border-[#3a3a3a] bg-[#202020]">
                <button
                    type="button"
                    onClick={onViewAll}
                    className="h-[45px] w-full py-3 text-xs font-medium text-white transition-colors hover:bg-[#292929]"
                >
                    Ver todas las notificaciones
                </button>
            </div>
        </div>
    );
}