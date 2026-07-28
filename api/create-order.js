import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function isValidPayload(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.customer_first_name?.trim()) return false;
  if (!payload.customer_phone?.trim()) return false;
  if (!Array.isArray(payload.items) || payload.items.length === 0) return false;
  if (!['pickup', 'delivery'].includes(payload.delivery_method)) return false;
  return true;
}

export default async function handler(request, response) {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(503).json({ error: 'Order API not configured' });
  }

  const payload = request.body;

  if (!isValidPayload(payload)) {
    return response.status(400).json({ error: 'Invalid order payload' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase.from('orders').insert(payload);

  if (error) {
    console.error('create-order API error:', error);
    return response.status(400).json({
      error: error.message,
      code: error.code,
    });
  }

  return response.status(201).json({ ok: true });
}
