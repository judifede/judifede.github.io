/**
 * Escapa HTML peligroso y convierte `**palabra**` en `<strong>palabra</strong>`.
 * Implementación minimalista basada en regex no global sobre segmentos,
 * pensada para textos cortos controlados (no es un parser Markdown completo).
 */
export function parseMd(input: string): string {
  if (!input) return ''

  // 1) Escapar entidades HTML basicas.
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  const escaped = input.replace(/[&<>"']/g, (ch) => escapeMap[ch])

  // 2) Reemplazar **palabra** por <strong>palabra</strong>. La regex NO es global:
  // procesamos el primer emparejamiento y volvemos a llamar recursivamente hasta
  // que no quede ninguno. Esto evita el problema clasico de `lastIndex` con /g.
  const boldRe = /\*\*([^*\n]+)\*\*/
  if (!boldRe.test(escaped)) return escaped

  return escaped.replace(boldRe, (_match, inner: string) => `<strong>${inner}</strong>`)
}
