export function parseToLocalDate(dateStr) {
  if (!dateStr) return null

  // If contains timezone info (Z or +/-), let Date parse it
  if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(dateStr)) {
    return new Date(dateStr)
  }

  // Handle ISO-like string without timezone: YYYY-MM-DDTHH:mm:ss(.sss?)
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/)

  if (m) {
    const [, y, mo, d, hh, mm, ss = '0', ms = '0'] = m
    return new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss),
      Number(ms.slice(0, 3)),
    )
  }

  // Fallback
  return new Date(dateStr)
}

export function formatRelative(dateStr) {
  const d = parseToLocalDate(dateStr)
  if (!d) return ''

  const now = new Date()
  const diff = Math.floor((now - d) / 60000)

  if (diff < 60) return `${diff}분 전`
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
  return d.toLocaleDateString()
}
