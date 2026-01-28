const privateIpv4 = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./
]

function isIpv4(hostname: string) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
}

export function isSafeRemoteUrl(rawUrl: string, options?: { allowedHosts?: string[] }) {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return false
  }

  if (url.protocol !== 'https:') return false

  const hostname = url.hostname.toLowerCase()
  if (hostname === 'localhost') return false
  if (hostname.endsWith('.localhost')) return false

  if (isIpv4(hostname) && privateIpv4.some((re) => re.test(hostname))) return false

  const allowedHosts = options?.allowedHosts?.map((h) => h.toLowerCase())
  if (allowedHosts && allowedHosts.length > 0) {
    return allowedHosts.includes(hostname)
  }

  return true
}
