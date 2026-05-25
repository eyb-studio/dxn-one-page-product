import { findOrderById } from '../_lib/airtable.js';
import { CURRENCY, SIZES } from '../_lib/pricing.js';

const ID_RE = /^DXN-[A-Z2-9]{6}$/;

const maskEmail = (e = '') => {
  const [u = '', d = ''] = e.split('@');
  if (!d) return '';
  const masked = u.length <= 2 ? u[0] + '*' : u[0] + '*'.repeat(u.length - 2) + u.slice(-1);
  return `${masked}@${d}`;
};

const maskPhone = (p = '') => (p.length >= 4 ? '•'.repeat(Math.max(0, p.length - 4)) + p.slice(-4) : p);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const id = (req.query?.id || '').toString().trim().toUpperCase();
  if (!ID_RE.test(id)) return res.status(400).json({ error: 'invalid_id' });

  let record;
  try {
    record = await findOrderById(id);
  } catch (err) {
    console.error('[orders/:id] airtable lookup failed:', err);
    return res.status(502).json({ error: 'storage_failed' });
  }

  if (!record) return res.status(404).json({ error: 'not_found' });

  const f = record.fields || {};

  const small = Number(f.quantity_small || 0);
  // Legacy orders only have `quantity` (Large). Backfill so the frontend
  // can render line items consistently.
  const large = Number(
    f.quantity_large != null ? f.quantity_large : f.quantity || 0
  );

  const items = [];
  if (large > 0) {
    items.push({ size: 'large', quantity: large, unitPrice: SIZES.large.price });
  }
  if (small > 0) {
    items.push({ size: 'small', quantity: small, unitPrice: SIZES.small.price });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    orderId: f.order_id,
    status: f.status || 'pending',
    name: f.name || '',
    phone: maskPhone(f.phone || ''),
    email: maskEmail(f.email || ''),
    language: f.language || 'en',
    address: {
      line: f.address_line || '',
      building: f.building || '',
      city: f.city || '',
      emirate: f.emirate || '',
    },
    items,
    quantity: Number(f.quantity || small + large),
    subtotal: Number(f.subtotal || 0),
    shipping: Number(f.shipping || 0),
    total: Number(f.total || 0),
    currency: CURRENCY,
    createdAt: record.createdTime,
  });
}
