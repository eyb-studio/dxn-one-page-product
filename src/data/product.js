// Two-size catalog. Shipping rule: any Small in the cart adds 20 AED;
// orders with only Large bottles ship free.

export const SIZES = {
  large: {
    key: 'large',
    id: 'dxn-spirulina-500-large',
    sku: 'DXN-SP-500-L',
    price: 299,
    available: 24,
    images: ['/dxn-1.jpeg', '/dxn-2.jpg', '/dxn-3.webp'],
    shippingFee: 0,
  },
  small: {
    key: 'small',
    id: 'dxn-spirulina-small',
    sku: 'DXN-SP-SMALL',
    price: 99,
    available: 24,
    images: ['/small-1.jpg', '/small-2.jpeg'],
    shippingFee: 20,
  },
};

export const SIZE_ORDER = ['large', 'small'];

export const PRODUCT = {
  id: 'dxn-spirulina',
  currency: 'AED',
  rating: 4.8,
  reviews: 142,
  defaultSize: 'large',
};

export function calcSubtotal(quantities) {
  return SIZE_ORDER.reduce(
    (sum, key) => sum + SIZES[key].price * (quantities?.[key] || 0),
    0
  );
}

export function calcShipping(quantities) {
  return (quantities?.small || 0) > 0 ? SIZES.small.shippingFee : 0;
}

export function totalQty(quantities) {
  return SIZE_ORDER.reduce((s, k) => s + (quantities?.[k] || 0), 0);
}

export function calcTotal(quantities) {
  return calcSubtotal(quantities) + calcShipping(quantities);
}
