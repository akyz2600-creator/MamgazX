/** Une nombres de clase ignorando valores vacíos o falsos. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
