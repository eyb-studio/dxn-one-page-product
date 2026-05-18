const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function block(length) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function generateTrackingId() {
  return `ORD-${block(4)}-${block(4)}`;
}
