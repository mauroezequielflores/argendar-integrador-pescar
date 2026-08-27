import { ArrowRightIcon, CalendarDaysIcon, StarIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function OfferSummary({ offer, onClose, onViewProfile, onAccept }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-[646px] overflow-hidden rounded-[4px] border border-[#323232] bg-[#202020] shadow-2xl">
                <div className="flex items-start justify-between border-b border-[#323232] px-5 py-4">
                    <div>
                        <h2 className="text-base font-bold text-white">Nueva oferta</h2>
                        <p className="mt-1 text-xs text-[#A8A8AA]">Un profesional publicó una nueva oferta en tu solicitud.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-[#A8A8AA] hover:text-white" aria-label="Cerrar">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5 sm:px-[70px]">
                    <p className="mb-2 text-xs font-medium text-white">Recibiste una oferta de {offer.professionalName} para su solicitud "{offer.requestTitle}"</p>
                    <div className="rounded-[4px] border border-[#3a3a3a] bg-[#292929] p-3.5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A8A8AA] text-xs font-bold text-white">{offer.professionalInitials}</div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-xs font-bold text-white">{offer.professionalName}</h3>
                                        <span className="flex items-center gap-0.5" aria-label={`${offer.rating} estrellas`}>
                                            {[1, 2, 3, 4, 5].map((star) => <StarIcon key={star} className={`h-3 w-3 ${star <= 4 ? "text-white" : "text-[#727272]"}`} />)}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-[9px] tracking-wide text-[#A8A8AA]">{offer.specialty}</p>
                                </div>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-lg font-bold text-white">{offer.price}</p>
                                <p className="text-[9px] text-[#A8A8AA]">Seña requerida: {offer.deposit}</p>
                            </div>
                        </div>

                        <p className="mt-4 text-[10px] leading-4 text-[#A8A8AA]">{offer.message}</p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#3a3a3a] pt-3">
                            <span className="flex items-center gap-1.5 text-[10px] text-[#A8A8AA]"><CalendarDaysIcon className="h-3 w-3 text-[#F78736]" />Disponibilidad: <strong className="text-white">{offer.availability}</strong></span>
                            <div className="flex gap-2">
                                <button type="button" onClick={onViewProfile} className="rounded-[5px] border border-[#727272] px-3 py-1.5 text-[10px] font-medium text-white hover:border-white">Ver Perfil Profesional</button>
                                <button type="button" onClick={onAccept} className="rounded-[5px] bg-[#F78736] px-3 py-1.5 text-[10px] font-medium text-white hover:bg-[#e06d00]">Aceptar Oferta</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#323232] px-5 py-3">
                    <button type="button" onClick={onClose} className="rounded-[5px] border border-[#323232] px-3 py-1.5 text-[10px] text-[#A8A8AA] hover:text-white">← Volver</button>
                    <button type="button" onClick={onClose} className="rounded-[5px] border border-[#727272] px-3 py-1.5 text-[10px] text-[#A8A8AA] hover:text-white">Cancelar</button>
                </div>
            </div>
        </div>
    );
}