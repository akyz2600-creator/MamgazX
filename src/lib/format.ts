/** Formato de fechas y números para mostrar al lector (español). */

const dateFormatter = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' });
const numberFormatter = new Intl.NumberFormat('es');
const compactFormatter = new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 });

/** Convierte `AAAA-MM-DD` en fecha local (evita el desfase de zona horaria de `new Date('AAAA-MM-DD')`). */
export function parseDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** "13 de noviembre de 2026" */
export function formatDate(iso: string): string {
  return dateFormatter.format(parseDate(iso));
}

/** "5.200" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** "5,2 mil" */
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}
