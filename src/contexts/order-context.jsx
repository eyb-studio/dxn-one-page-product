import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { SIZES, SIZE_ORDER } from '../data/product';

const OrderContext = createContext(null);

// items: [{ size: 'large', quantity: 2 }, ...]
const EMPTY_ITEMS = [];

const clampQty = (size, qty) => {
  const max = SIZES[size]?.available ?? 20;
  return Math.max(0, Math.min(max, Number(qty) || 0));
};

export function OrderProvider({ children }) {
  const [items, setItems] = useState(EMPTY_ITEMS);
  const [address, setAddress] = useState(null);

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
