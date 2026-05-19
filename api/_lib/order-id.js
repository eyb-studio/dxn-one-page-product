import { randomBytes } from 'node:crypto';

// Crockford-friendly alphabet — no 0/O, 1/I/L confusables.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateOrderId() {
  const bytes = randomBytes(6);
  let out = '';
  for (let i = 0; i < 6; i += 1) out += ALPHABET[bytes[i] % ALPHABET.length];
  return `DXN-${out}`;
}
