export function sanitizeText(input: string) {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function safeFilename(input: string) {
  return sanitizeText(input).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
}
