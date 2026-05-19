import { Resend } from 'resend';
import { createOrder } from './_lib/airtable.js';
import { generateOrderId } from './_lib/order-id.js';
import { quote, CURRENCY } from './_lib/pricing.js';
import { buildOrderEmail } from './_lib/email-template.js';

const UAE_MOBILE_RE = /^0(50|52|54|55|56|58)\d{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toWestern = (s = '') =>
  s
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30))
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x30));

const normalizePhone = (v = '') => {
  const d = toWestern(String(v)).replace(/\D/g, '');
  if (d.startsWith('00971')) return '0' + d.slice(5);
  if (d.startsWith('971')) return '0' + d.slice(3);
  return d;
};

function validate(body) {
  const errors = [];
  const str = (k, max = 200) => {
    const v = (body?.[k] ?? '').toString().trim();
    if (!v) errors.push(`${k} is required`);
    if (v.length > max) errors.push(`${k} is too long`);
    return v;
  };

  const name = str('name', 120);
  const phone = normalizePhone(body?.phone);
  if (!UAE_MOBILE_RE.test(phone)) errors.push('phone must be a UAE mobile number');
  const email = (body?.email ?? '').toString().trim().toLowerCase();
  if (!EMAIL_RE.test(email)) errors.push('email is invalid');

  const address_line = str('address', 250);
  const building = str('building', 120);
  const city = str('city', 80);
  const emirate = str('emirate', 80);
  const notes = (body?.notes ?? '').toString().slice(0, 500);

  const quantity = Number.parseInt(body?.quantity, 10);
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
    errors.push('quantity must be between 1 and 20');
  }

  const language = body?.language === 'ar' ? 'ar' : 'en';

  const lat = Number(body?.coords?.lat);
  const lng = Number(body?.coords?.lng);

  return { errors, name, phone, email, address_line, building, city, emirate, notes, quantity, language, lat, lng };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const v = validate(body);
  if (v.errors.length) return res.status(400).json({ error: 'validation', details: v.errors });

  const { subtotal, shipping, total, quantity } = quote(v.quantity);
  const orderId = generateOrderId();
  const appUrl = (process.env.APP_URL || `https://${req.headers.host}`).replace(/\/$/, '');

  try {
    await createOrder({
      order_id: orderId,
      status: 'pending',
      name: v.name,
      phone: v.phone,
      email: v.email,
      language: v.language,
      address_line: v.address_line,
      building: v.building,
      city: v.city,
      emirate: v.emirate,
      notes: v.notes,
      lat: Number.isFinite(v.lat) ? v.lat : undefined,
      lng: Number.isFinite(v.lng) ? v.lng : undefined,
      quantity,
      subtotal,
      shipping,
      total,
    });
  } catch (err) {
    console.error('[orders] airtable create failed:', err);
    return res.status(502).json({
      error: 'storage_failed',
      detail: String(err?.message || err),
    });
  }

  // Fire email best-effort — failure must not roll back a real order.
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { subject, html } = buildOrderEmail({
        order: {
          orderId,
          name: v.name,
          phone: v.phone,
          email: v.email,
          address_line: v.address_line,
          building: v.building,
          city: v.city,
          emirate: v.emirate,
          quantity,
          subtotal,
          shipping,
          total,
          currency: CURRENCY,
        },
        lang: v.language,
        appUrl,
      });
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: v.email,
        subject,
        html,
      });
    }
  } catch (err) {
    console.error('[orders] resend send failed:', err);
  }

  return res.status(201).json({ orderId, status: 'pending' });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
