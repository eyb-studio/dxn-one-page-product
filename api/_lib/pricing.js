// Authoritative pricing constants. Mirror src/data/product.js but kept
// server-side so totals can never be tampered with by the client.
export const PRICE = 350;
export const CURRENCY = 'AED';
export const SHIPPING_FEE = 15;
export const FREE_SHIPPING_AT_QTY = 2;

export function quote(quantity) {
  const qty = Math.max(1, Math.min(20, Number.parseInt(quantity, 10) || 1));
  const subtotal = PRICE * qty;
  const shipping = qty >= FREE_SHIPPING_AT_QTY ? 0 : SHIPPING_FEE;
  return { quantity: qty, subtotal, shipping, total: subtotal + shipping };
}
