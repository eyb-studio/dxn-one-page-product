import { createContext, useContext, useMemo, useState } from 'react';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(null);

  const value = useMemo(
    () => ({
      quantity,
      setQuantity,
      address,
      setAddress,
      reset: () => {
        setQuantity(1);
        setAddress(null);
      },
    }),
    [quantity, address]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>');
  return ctx;
}
