import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { SIZES, SIZE_ORDER } from '../data/product';

const OrderContext = createContext(null);

// items: [{ size: 'large', quantity: 2 }, ...]
const EMPTY_ITEMS = [];

const STORAGE_KEY = 'dxn:order:v1';

const clampQty = (size, qty) => {
  const max = SIZES[size]?.available ?? 20;
  return Math.max(0, Math.min(max, Number(qty) || 0));
};

const loadFromStorage = () => {
  if (typeof window === 'undefined') return { items: EMPTY_ITEMS, address: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: EMPTY_ITEMS, address: null };
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items)
      ? parsed.items
          .filter((i) => i && SIZES[i.size])
          .map((i) => ({ size: i.size, quantity: clampQty(i.size, i.quantity) }))
          .filter((i) => i.quantity > 0)
      : EMPTY_ITEMS;
    const address = parsed?.address && typeof parsed.address === 'object' ? parsed.address : null;
    return { items, address };
  } catch {
    return { items: EMPTY_ITEMS, address: null };
  }
};

export function OrderProvider({ children }) {
  const initial = useMemo(loadFromStorage, []);
  const [items, setItems] = useState(initial.items);
  const [address, setAddress] = useState(initial.address);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, address }));
    } catch {
      // quota / private mode — silently ignore
    }
  }, [items, address]);

  const addItem = useCallback((size, qty = 1) => {
    if (!SIZES[size]) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.size === size ? { ...i, quantity: clampQty(size, i.quantity + qty) } : i
        );
      }
      return [...prev, { size, quantity: clampQty(size, qty) }];
    });
  }, []);

  const setItemQuantity = useCallback((size, qty) => {
    setItems((prev) => {
      const next = clampQty(size, qty);
      if (next <= 0) return prev.filter((i) => i.size !== size);
      const existing = prev.find((i) => i.size === size);
      if (existing) {
        return prev.map((i) => (i.size === size ? { ...i, quantity: next } : i));
      }
      return [...prev, { size, quantity: next }];
    });
  }, []);

  const removeItem = useCallback((size) => {
    setItems((prev) => prev.filter((i) => i.size !== size));
  }, []);

  const reset = useCallback(() => {
    setItems(EMPTY_ITEMS);
    setAddress(null);
  }, []);

  const value = useMemo(() => {
    // Order items by SIZE_ORDER for stable rendering across the app.
    const orderedItems = [...items].sort(
      (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
    );
    const totalItems = orderedItems.reduce((s, i) => s + i.quantity, 0);
    const subtotal = orderedItems.reduce(
      (s, i) => s + SIZES[i.size].price * i.quantity,
      0
    );
    // Any Small in the cart triggers the small-bottle shipping fee.
    const hasSmall = orderedItems.some((i) => i.size === 'small' && i.quantity > 0);
    const shipping = hasSmall ? SIZES.small.shippingFee : 0;
    return {
      items: orderedItems,
      addItem,
      setItemQuantity,
      removeItem,
      totalItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      address,
      setAddress,
      reset,
    };
  }, [items, address, addItem, setItemQuantity, removeItem, reset]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>');
  return ctx;
}
