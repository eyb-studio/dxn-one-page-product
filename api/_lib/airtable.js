const BASE = 'https://api.airtable.com/v0';

const env = () => {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || 'Orders';
  if (!token || !baseId) {
    throw new Error('Airtable env vars not configured (AIRTABLE_TOKEN / AIRTABLE_BASE_ID).');
  }
  return { token, baseId, table };
};

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export async function createOrder(fields) {
  const { token, baseId, table } = env();
  const res = await fetch(`${BASE}/${baseId}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable create failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function findOrderById(orderId) {
  const { token, baseId, table } = env();
  const formula = encodeURIComponent(`{order_id}='${orderId.replace(/'/g, "\\'")}'`);
  const url = `${BASE}/${baseId}/${encodeURIComponent(table)}?filterByFormula=${formula}&maxRecords=1`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable lookup failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.records?.[0] ?? null;
}
