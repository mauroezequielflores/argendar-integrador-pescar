import React from "react";
import InquiryRow from "./InquiryRow";
import { TABLE_COLUMNS } from "../constants/reports.constants";

/**
 * InquiriesTable — Tabla estructurada para listado de consultas de soporte según captura de diseño.
 *
 * @param {Array} inquiries - Lista de consultas a renderizar.
 * @param {function} onSelectInquiry - Callback al hacer clic en una consulta.
 */
export default function InquiriesTable({ inquiries = [], onSelectInquiry }) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-[#323232] bg-[#292929]">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-[#A8A8AA]">
          <thead className="border-b border-[#323232] bg-[#242424]/60 text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3.5 ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#323232]/50">
            {inquiries.map((inquiry) => (
              <InquiryRow
                key={inquiry.id}
                inquiry={inquiry}
                onSelect={onSelectInquiry}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
