export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) {
  const controller = new AbortController()
  const timeoutMs = init.timeoutMs ?? 8000
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const { timeoutMs: _ignored, ...rest } = init
    return await fetch(input, { ...rest, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
