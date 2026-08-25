import Badge from "../../../components/ui/Badge";
import DataTable from "../../../components/ui/DataTable";
import Avatar from "../../../components/ui/Avatar";

/**
 * ActivityTable — Tabla de actividades recientes para el Dashboard de Administrador.
 * Cumple con el criterio CA03:
 * Columnas: "Usuario/Profesional", "Evento", "Rol", "Tiempo" y "Estado".
 *
 * @param {Array<object>} activities - Lista de eventos recientes.
 * @param {boolean} isLoading - Estado de carga.
 */
export default function ActivityTable({ activities = [], isLoading = false }) {
  const columns = [
    {
      key: "usuario",
      label: "Usuario/Profesional",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            initials={row.usuario ? row.usuario.charAt(0) : "U"}
            size="sm"
          />
          <span className="font-medium text-white">{row.usuario}</span>
        </div>
      ),
    },
    {
      key: "evento",
      label: "Evento",
      render: (row) => <span className="text-white">{row.evento}</span>,
    },
    {
      key: "rol",
      label: "Rol",
      render: (row) => (
        <Badge variant="default" className="text-xs">
          {row.rol}
        </Badge>
      ),
    },
    {
      key: "tiempo",
      label: "Tiempo",
      render: (row) => <span className="text-[#A8A8AA] text-xs">{row.tiempo}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge
          variant={row.estadoVariant || (row.estado === "Confirmado" ? "success" : row.estado === "Pendiente" ? "warning" : "orange")}
        >
          {row.estado}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={activities}
      isLoading={isLoading}
      keyExtractor={(row) => row.id}
    />
  );
}
