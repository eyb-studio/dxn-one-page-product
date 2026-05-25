// Bilingual order-confirmation email. Inline styles only — most mail
// clients strip <style> blocks. RTL applied to <body> when language === 'ar'.

import { SIZES } from './pricing.js';

const COPY = {
  en: {
    subject: (id) => `Your DXN Spirulina order is confirmed — ${id}`,
    preheader: 'Thanks for your order. Our team will WhatsApp you shortly to confirm delivery.',
    greeting: (name) => `Hi ${name},`,
    intro:
      'Thanks for your order! We have received it and will WhatsApp or call you shortly on the number you provided to confirm the delivery time.',
    order_no: 'Order number',
    summary: 'Order summary',
    product: 'DXN Spirulina · 250 mg',
    size_label: { large: 'Large bottle · 500 tablets', small: 'Small bottle · 120 tablets' },
    qty: 'Qty',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shipping_free: 'FREE',
    total: 'Total',
    delivery: 'Delivery address',
    payment: 'Payment',
    payment_value: 'Cash on Delivery — pay when you receive your order.',
    track_cta: 'Track Your Order',
    next_steps: 'What happens next',
    step_1: 'Our team will contact you within a few hours to confirm delivery.',
    step_2: 'Your order will be packed and dispatched within 1–2 business days.',
    step_3: 'You pay cash to the courier when your order arrives.',
    footer: 'DXN Spirulina · Delivered across the UAE',
    contact: 'Questions? Reply to this email and our team will help.',
    dir: 'ltr',
    align: 'left',
  },
  ar: {
    subject: (id) => `تم تأكيد طلب دي إكس إن سبيرولينا — ${id}`,
    preheader: 'شكرًا لطلبك. سيتواصل معك فريقنا عبر واتساب قريبًا لتأكيد التوصيل.',
    greeting: (name) => `مرحبًا ${name}،`,
    intro:
      'شكرًا لطلبك! لقد استلمناه وسنتواصل معك قريبًا عبر واتساب أو هاتفيًا على الرقم الذي قدّمته لتأكيد وقت التوصيل.',
    order_no: 'رقم الطلب',
    summary: 'ملخص الطلب',
    product: 'دي إكس إن سبيرولينا · 250 ملغم',
    size_label: { large: 'علبة كبيرة · 500 قرص', small: 'علبة صغيرة · 120 قرص' },
    qty: 'الكمية',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    shipping_free: 'مجاني',
    total: 'الإجمالي',
    delivery: 'عنوان التوصيل',
    payment: 'طريقة الدفع',
    payment_value: 'الدفع عند الاستلام — تدفع نقدًا عند وصول طلبك.',
    track_cta: 'تتبع طلبك',
    next_steps: 'الخطوات التالية',
    step_1: 'سيتواصل معك فريقنا خلال ساعات قليلة لتأكيد التوصيل.',
    step_2: 'سيتم تعبئة طلبك وشحنه خلال 1–2 أيام عمل.',
    step_3: 'تدفع نقدًا للمندوب عند وصول طلبك.',
    footer: 'دي إكس إن سبيرولينا · توصيل في جميع أنحاء الإمارات',
    contact: 'هل لديك أي سؤال؟ ردّ على هذا البريد وسيتواصل معك فريقنا.',
    dir: 'rtl',
    align: 'right',
  },
};

const money = (v, currency) => `${currency} ${Number(v).toFixed(2)}`;

export function buildOrderEmail({ order, lang = 'en', appUrl }) {
  const t = COPY[lang] || COPY.en;
  const trackUrl = `${appUrl}/track?order=${encodeURIComponent(order.orderId)}`;
  const addressLine = [order.address_line, order.building, order.city, order.emirate]
    .filter(Boolean)
    .join(' · ');

  const oppositeAlign = t.align === 'left' ? 'right' : 'left';

  // Normalise to an array of line items so the loop is uniform regardless
  // of which payload shape we received from api/orders.js.
  const items =
    Array.isArray(order.items) && order.items.length
      ? order.items
      : [{ size: 'large', quantity: order.quantity || 0 }];

  const itemRows = items
    .map((item, idx) => {
      const size = SIZES[item.size] ? item.size : 'large';
      const lineTotal = item.quantity * SIZES[size].price;
      const isLast = idx === items.length - 1;
      const border = isLast ? '1px solid #EDEFF2' : '1px dashed #EDEFF2';
      return `
                  <tr>
                    <td style="padding:12px 0;border-bottom:${border};font-size:14px;">
                      <div style="font-weight:600;">${t.product}</div>
                      <div style="color:#637381;font-size:13px;margin-top:2px;">${escapeHtml(
                        t.size_label[size]
                      )} · ${t.qty}: ${item.quantity}</div>
                    </td>
                    <td style="padding:12px 0;border-bottom:${border};font-size:14px;text-align:${oppositeAlign};vertical-align:top;">
                      ${money(lineTotal, order.currency)}
                    </td>
                  </tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${t.subject(order.orderId)}</title>
  </head>
  <body style="margin:0;padding:0;background:#F4F6F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#212B36;direction:${t.dir};text-align:${t.align};">
    <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">${t.preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04);">

            <tr>
              <td style="background:linear-gradient(135deg,#00A76F 0%,#007867 100%);padding:28px 32px;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:2px;opacity:0.85;text-transform:uppercase;">DXN Spirulina</div>
                <div style="font-size:24px;font-weight:700;margin-top:6px;">${t.subject(order.orderId).split('—')[0].trim()}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 12px 0;font-size:16px;">${t.greeting(escapeHtml(order.name))}</p>
                <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#637381;">${t.intro}</p>

                <div style="background:#F4F6F8;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                  <div style="font-size:12px;color:#637381;text-transform:uppercase;letter-spacing:1px;">${t.order_no}</div>
                  <div style="font-size:20px;font-weight:700;font-family:'SF Mono',Menlo,Consolas,monospace;margin-top:4px;">${order.orderId}</div>
                </div>

                <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#637381;margin:0 0 12px 0;">${t.summary}</h3>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
                  ${itemRows}
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:#637381;">${t.subtotal}</td>
                    <td style="padding:10px 0;font-size:14px;text-align:${oppositeAlign};">${money(order.subtotal, order.currency)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:#637381;">${t.shipping}</td>
                    <td style="padding:10px 0;font-size:14px;color:${order.shipping === 0 ? '#118D57' : '#637381'};font-weight:${order.shipping === 0 ? '700' : '400'};text-align:${oppositeAlign};">
                      ${order.shipping === 0 ? t.shipping_free : money(order.shipping, order.currency)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 0 4px 0;border-top:2px solid #212B36;font-size:16px;font-weight:700;">${t.total}</td>
                    <td style="padding:14px 0 4px 0;border-top:2px solid #212B36;font-size:18px;font-weight:700;text-align:${oppositeAlign};">
                      ${money(order.total, order.currency)}
                    </td>
                  </tr>
                </table>

                <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#637381;margin:0 0 8px 0;">${t.delivery}</h3>
                <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;">${escapeHtml(order.name)} · ${escapeHtml(order.phone)}</p>
                <p style="margin:0 0 24px 0;font-size:14px;color:#637381;line-height:1.6;">${escapeHtml(addressLine)}</p>

                <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#637381;margin:0 0 8px 0;">${t.payment}</h3>
                <p style="margin:0 0 28px 0;font-size:14px;color:#637381;">${t.payment_value}</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:8px 0 28px 0;">
                      <a href="${trackUrl}" style="display:inline-block;background:#00A76F;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;">${t.track_cta}</a>
                    </td>
                  </tr>
                </table>

                <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#637381;margin:0 0 12px 0;">${t.next_steps}</h3>
                <ol style="margin:0 0 24px 0;padding-${t.align === 'left' ? 'left' : 'right'}:20px;font-size:14px;color:#637381;line-height:1.8;">
                  <li>${t.step_1}</li>
                  <li>${t.step_2}</li>
                  <li>${t.step_3}</li>
                </ol>

                <p style="margin:0;font-size:13px;color:#919EAB;line-height:1.6;">${t.contact}</p>
              </td>
            </tr>

            <tr>
              <td style="background:#F4F6F8;padding:18px 32px;text-align:center;font-size:12px;color:#919EAB;">
                ${t.footer}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: t.subject(order.orderId), html };
}

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
