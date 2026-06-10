// All admin scheduling happens in São Paulo time (Brazil abolished DST in 2019,
// so America/Sao_Paulo is a fixed UTC-3 offset). The database stores UTC.

const SP_OFFSET = "-03:00";

/** "2026-06-12T17:00" (datetime-local, São Paulo) → "2026-06-12T20:00:00.000Z". */
export function spLocalToUtcIso(local: string): string {
  const withSeconds = local.length === 16 ? `${local}:00` : local;
  return new Date(`${withSeconds}${SP_OFFSET}`).toISOString();
}

/** UTC ISO → "YYYY-MM-DDTHH:mm" in São Paulo time, for datetime-local inputs. */
export function utcIsoToSpLocal(iso: string): string {
  const date = new Date(iso);
  const shifted = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

/** UTC ISO → "12/06/2026, 17:00" (pt-BR, São Paulo) for display. */
export function formatSaoPaulo(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
