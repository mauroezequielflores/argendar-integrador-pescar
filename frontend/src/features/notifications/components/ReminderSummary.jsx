import { ArrowRightIcon, CalendarDaysIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ReminderSummary({ reminder, onClose, onViewDetails }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-[488px] overflow-hidden rounded-[6px] border border-[#323232] bg-[#202020] shadow-2xl">
                <div className="flex items-start justify-between border-b border-[#323232] px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">Recordatorio</h2>
                        <p className="mt-1 text-xs text-[#A8A8AA]">Hoy tenés un turno con {reminder.professionalName}.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-[#A8A8AA] hover:text-white" aria-label="Cerrar">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-5">
                    <p className="mb-2 text-xs font-medium text-white">Hoy tenés un turno con {reminder.professionalName}.</p>
                    <div className="rounded-[4px] border border-[#323232] bg-[#292929] p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A8A8AA] text-xs font-bold text-white">{reminder.professionalInitials}</div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-medium text-white">{reminder.serviceName}</h3>
                                        <span className="rounded-[4px] border border-[#A8A8AA] px-2 py-0.5 text-[9px] text-[#A8A8AA]">{reminder.status}</span>
                                    </div>
                                    <p className="mt-1 text-xs font-medium text-white">{reminder.professionalName}</p>
                                </div>
                            </div>
                            <span className="flex shrink-0 items-center gap-1 text-[10px] text-[#A8A8AA]"><ClockIcon className="h-3 w-3" />{reminder.timeAgo}</span>
                        </div>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pl-[52px]">
                            <span className="flex items-center gap-2 text-xs text-[#A8A8AA]"><CalendarDaysIcon className="h-4 w-4 text-[#F78736]" />{reminder.date}</span>
                            <button type="button" onClick={onViewDetails} className="flex items-center gap-2 rounded-[6px] border border-[#727272] px-3 py-2 text-xs text-white hover:border-white">Ver detalle <ArrowRightIcon className="h-3.5 w-3.5" /></button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end border-t border-[#323232] px-5 py-3"><button type="button" onClick={onClose} className="rounded-[6px] border border-[#323232] px-3 py-2 text-xs text-[#A8A8AA] hover:text-white">Cerrar</button></div>
            </div>
        </div>
    );
}