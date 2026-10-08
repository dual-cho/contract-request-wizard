// Letters + name punctuation (O'Neil, Jean-Luc, J. Doe)
export const NAME_PATTERN = /^\p{L}[\p{L}\p{M}' .-]*$/u

// 7-15 digits, optional +, (area code), single space/dot/dash separators
export const PHONE_PATTERN = /^\+?(?:[0-9][\s.-]?|\([0-9]{1,4}\)[\s.-]?){6,14}[0-9]$/

// Simplified RFC 5322: no stray dots in local part, TLD 2+ letters
export const EMAIL_PATTERN =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
