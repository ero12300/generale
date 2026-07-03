/** Logica campagna "Porta un Amico". */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // senza caratteri ambigui

export function generateReferralCode(fullName: string, seed?: number): string {
  const prefix = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");
  let n = seed ?? Math.floor(Math.random() * ALPHABET.length ** 4);
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += ALPHABET[n % ALPHABET.length];
    n = Math.floor(n / ALPHABET.length);
  }
  return `${prefix}-${suffix}`;
}

export function isValidReferralCode(code: string): boolean {
  return /^[A-Z]{4}-[A-HJ-NP-Z2-9]{4}$/.test(code.trim().toUpperCase());
}
