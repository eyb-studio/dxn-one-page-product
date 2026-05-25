// Authoritative pricing constants. Mirror src/data/product.js but kept
// server-side so totals can never be tampered with by the client.

export const CURRENCY = 'AED';

export const SIZES = {
  large: { price: 299, sku: 'DXN-SP-500-L', shippingFee: 0 },
  small: { price: 99, sku: 'DXN-SP-SMALL', shippingFee: 20 },
};

const MAX_QTY = 20;

const clampQty = (v) => {
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(MAX_QTY, n);
};

// Accepts:
//   { items: [{ size, quantity }, ...] }   ← cart payloads
//   { size, quantity }                      ← legacy single-size
//   { quantity }                            ← oldest payloads (treated as Large)
export function quote(input) {
  let raw = [];
  if (Array.isArray(input?.items)) {
    raw = input.items;
  } else if (input?.size) {
    raw = [{ size: input.size, quantity: input.quantity }];
  } else if (input?.quantity != null) {
    raw = [{ size: 'large', quantity: input.quantity }];
  }

  const byKey = new Map();
  for (const row of raw) {
    if (!SIZES[row?.size]) continue;
    const qty = clampQty(row.quantity);
    if (qty <= 0) continue;
    byKey.set(row.size, (byKey.get(row.size) || 0) + qty);
  }

  const items = [...byKey.entries()].map(([size, quantity]) => ({
    size,
    quantity,
    unit_price: SIZES[size].price,
    line_total: SIZES[size].price * quantity,
    sku: SIZES[size].sku,
  }));

  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const hasSmall = items.some((i) => i.size === 'small');
  const shipping = hasSmall ? SIZES.small.shippingFee : 0;
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);

  return {
    items,
    quantity: totalQuantity,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

export function summarizeItems(items, lang = 'en') {
  const label = (size) => {
    if (lang === 'ar') return size === 'large' ? 'كبيرة' : 'صغيرة';
    return size === 'large' ? 'Large' : 'Small';
  };
  return items.map((i) => `${i.quantity}× ${label(i.size)}`).join(', ');
}
