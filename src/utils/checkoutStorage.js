import { EMPTY_DELIVERY_FIELDS } from '../constants/delivery';

export const CHECKOUT_DATA_STORAGE_KEY = 'vitta_checkout_data_v1';

const STORED_FIELD_KEYS = [
  'recipientName',
  'recipientPhone',
  'deliveryAddress',
  'locality',
  'postalCode',
  'apartment',
  'deliveryNotes',
];

function pickStoredFields(fields = EMPTY_DELIVERY_FIELDS) {
  return STORED_FIELD_KEYS.reduce((stored, key) => {
    stored[key] = fields[key] ?? '';
    return stored;
  }, {});
}

export function hasCheckoutData() {
  if (typeof window === 'undefined') return false;

  try {
    const raw = window.localStorage.getItem(CHECKOUT_DATA_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.deliveryMethod) return true;

    return STORED_FIELD_KEYS.some((key) => String(parsed[key] ?? '').trim());
  } catch {
    return false;
  }
}

export function loadCheckoutData() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CHECKOUT_DATA_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      deliveryMethod: parsed.deliveryMethod ?? '',
      fields: {
        ...EMPTY_DELIVERY_FIELDS,
        ...pickStoredFields(parsed),
      },
    };
  } catch {
    return null;
  }
}

export function saveCheckoutData({ deliveryMethod, deliveryFields }) {
  if (typeof window === 'undefined') return;

  try {
    const payload = {
      deliveryMethod: deliveryMethod ?? '',
      ...pickStoredFields(deliveryFields),
    };

    window.localStorage.setItem(CHECKOUT_DATA_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures.
  }
}

export function clearCheckoutData() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(CHECKOUT_DATA_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function mergeSavedCheckoutFields(currentFields, savedFields, touchedKeys = new Set()) {
  const next = { ...currentFields };

  for (const key of STORED_FIELD_KEYS) {
    if (touchedKeys.has(key)) continue;
    if (String(currentFields[key] ?? '').trim()) continue;
    if (savedFields[key]) next[key] = savedFields[key];
  }

  return next;
}
