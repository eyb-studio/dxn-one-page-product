import { useEffect, useState } from 'react';

export function useOrderLookup(orderId) {
  const [state, setState] = useState({ order: null, error: null, loading: false });

  useEffect(() => {
    if (!orderId) {
      setState({ order: null, error: null, loading: false });
      return undefined;
    }

    const controller = new AbortController();
    setState({ order: null, error: null, loading: true });

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'not_found' : 'fetch_failed');
        }
        return res.json();
      })
      .then((order) => setState({ order, error: null, loading: false }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ order: null, error: err.message || 'fetch_failed', loading: false });
      });

    return () => controller.abort();
  }, [orderId]);

  return state;
}
