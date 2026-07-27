import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getCatalogProduct } from '../data/catalog';
import { formatPrice } from '../utils/price';
import { getInitialSinTacc, parseStoredSinTacc } from '../utils/preparation';
import { computeCartTotals } from '../utils/whatsappOrder';

const CartContext = createContext(null);
const STORAGE_KEY = 'vitta-cart-v2';
const LEGACY_STORAGE_KEY = 'vitta-cart-v1';

function buildLineItem(product, quantity, extras = {}) {
  const minQuantity = product.minQuantity ?? 1;
  const safeQuantity = Math.max(minQuantity, quantity);
  const sinTacc = extras.sinTacc !== undefined ? extras.sinTacc : getInitialSinTacc(product);
  const totalWeightGrams = product.gramsPerUnit ? product.gramsPerUnit * safeQuantity : null;

  return {
    productId: product.id,
    section: product.section,
    category: product.category,
    name: product.name,
    presentationLabel: product.presentationLabel,
    quantity: safeQuantity,
    quantityUnit: product.quantityUnit ?? 'unidad',
    unitPrice: product.unitPrice,
    unitPriceLabel: product.unitPriceLabel,
    gramsPerUnit: product.gramsPerUnit ?? null,
    totalWeightGrams,
    preparationMode: product.preparationMode,
    sinTacc,
    subtotal: safeQuantity * product.unitPrice,
  };
}

function normalizeStoredItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((raw) => {
      const product = getCatalogProduct(raw.productId);
      if (!product) return null;

      return buildLineItem(product, raw.quantity ?? 1, {
        sinTacc: parseStoredSinTacc(raw, product),
      });
    })
    .filter(Boolean);
}

function loadStoredCart() {
  if (typeof window === 'undefined') {
    return { items: [], orderNotes: '' };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return { items: normalizeStoredItems(parsed), orderNotes: '' };
      }
      return {
        items: normalizeStoredItems(parsed.items),
        orderNotes: parsed.orderNotes ?? '',
      };
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      return { items: normalizeStoredItems(JSON.parse(legacy)), orderNotes: '' };
    }
  } catch {
    return { items: [], orderNotes: '' };
  }

  return { items: [], orderNotes: '' };
}

function persistCart(items, orderNotes) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, orderNotes }));
  }
}

export function CartProvider({ children }) {
  const initialCart = loadStoredCart();
  const [items, setItems] = useState(initialCart.items);
  const [orderNotes, setOrderNotesState] = useState(initialCart.orderNotes);
  const [isOpen, setIsOpen] = useState(false);

  const setProductQuantity = useCallback((productId, quantity, preserve = {}) => {
    const product = getCatalogProduct(productId);
    if (!product) return;

    setItems((current) => {
      const index = current.findIndex((item) => item.productId === productId);
      const nextQuantity = Math.max(0, quantity);
      let next;

      if (nextQuantity === 0) {
        next = current.filter((item) => item.productId !== productId);
      } else {
        const existing = index === -1 ? null : current[index];
        const lineItem = buildLineItem(product, nextQuantity, {
          sinTacc:
            preserve.sinTacc ??
            existing?.sinTacc ??
            getInitialSinTacc(product),
        });

        if (index === -1) {
          next = [...current, lineItem];
        } else {
          next = [...current];
          next[index] = lineItem;
        }
      }

      persistCart(next, orderNotes);
      return next;
    });
  }, [orderNotes]);

  const addProduct = useCallback((productId, quantity = 1) => {
    const product = getCatalogProduct(productId);
    if (!product) return;

    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      const nextQuantity = (existing?.quantity ?? 0) + quantity;
      const lineItem = buildLineItem(product, nextQuantity, {
        sinTacc: existing?.sinTacc ?? getInitialSinTacc(product),
      });
      const next = existing
        ? current.map((item) => (item.productId === productId ? lineItem : item))
        : [...current, lineItem];

      persistCart(next, orderNotes);
      return next;
    });
  }, [orderNotes]);

  const incrementProduct = useCallback(
    (productId) => {
      const current = items.find((item) => item.productId === productId);
      if (!current) return;
      setProductQuantity(productId, current.quantity + 1, {
        sinTacc: current.sinTacc,
      });
    },
    [items, setProductQuantity],
  );

  const decrementProduct = useCallback(
    (productId) => {
      const product = getCatalogProduct(productId);
      if (!product) return;
      const current = items.find((item) => item.productId === productId);
      if (!current) return;
      const minQty = product.minQuantity ?? 1;
      const nextQuantity = current.quantity - 1;
      if (nextQuantity < minQty) {
        setProductQuantity(productId, 0);
        return;
      }
      setProductQuantity(productId, nextQuantity, {
        sinTacc: current.sinTacc,
      });
    },
    [items, setProductQuantity],
  );

  const removeProduct = useCallback(
    (productId) => {
      setProductQuantity(productId, 0);
    },
    [setProductQuantity],
  );

  const setItemSinTacc = useCallback(
    (productId, sinTacc) => {
      setItems((prev) => {
        const next = prev.map((item) =>
          item.productId === productId ? { ...item, sinTacc } : item,
        );
        persistCart(next, orderNotes);
        return next;
      });
    },
    [orderNotes],
  );

  const setOrderNotes = useCallback((notes) => {
    setOrderNotesState(notes);
    persistCart(items, notes);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
    setOrderNotesState('');
    persistCart([], '');
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totals = useMemo(() => computeCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      orderNotes,
      isOpen,
      totalItems: totals.totalUnits,
      totalAmount: totals.totalAmount,
      totalWeightGrams: totals.totalWeightGrams,
      totalAmountLabel: formatPrice(totals.totalAmount),
      addProduct,
      setProductQuantity,
      incrementProduct,
      decrementProduct,
      removeProduct,
      setItemSinTacc,
      setOrderNotes,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      orderNotes,
      isOpen,
      totals,
      addProduct,
      setProductQuantity,
      incrementProduct,
      decrementProduct,
      removeProduct,
      setItemSinTacc,
      setOrderNotes,
      clearCart,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
