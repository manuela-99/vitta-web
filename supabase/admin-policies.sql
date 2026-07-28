-- Checkout público + panel admin para public.orders
-- Ejecutar completo en el SQL Editor de Supabase (Dashboard > SQL Editor > New query).

-- 1. Permisos de esquema (sin esto los GRANT de tabla no aplican)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Permisos de tabla
GRANT INSERT ON TABLE public.orders TO anon;
GRANT INSERT, SELECT, UPDATE ON TABLE public.orders TO authenticated;

-- 3. RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can read orders" ON public.orders;
CREATE POLICY "Authenticated can read orders"
ON public.orders
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can update orders" ON public.orders;
CREATE POLICY "Authenticated can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Función RPC para checkout (SECURITY DEFINER: inserta aunque falten GRANT directos)
CREATE OR REPLACE FUNCTION public.create_public_order(payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  delivery_method text;
BEGIN
  delivery_method := payload->>'delivery_method';

  IF delivery_method NOT IN ('pickup', 'delivery') THEN
    RAISE EXCEPTION 'delivery_method inválido';
  END IF;

  IF COALESCE(trim(payload->>'customer_first_name'), '') = '' THEN
    RAISE EXCEPTION 'customer_first_name requerido';
  END IF;

  IF COALESCE(trim(payload->>'customer_phone'), '') = '' THEN
    RAISE EXCEPTION 'customer_phone requerido';
  END IF;

  IF payload->'items' IS NULL
    OR jsonb_typeof(payload->'items') <> 'array'
    OR jsonb_array_length(payload->'items') = 0 THEN
    RAISE EXCEPTION 'items requerido';
  END IF;

  INSERT INTO public.orders (
    customer_first_name,
    customer_last_name,
    customer_phone,
    items,
    notes,
    delivery_method,
    delivery_fee,
    delivery_address,
    locality,
    postal_code,
    apartment,
    cross_streets,
    delivery_notes,
    subtotal,
    total,
    payment_method,
    payment_status,
    order_status
  ) VALUES (
    trim(payload->>'customer_first_name'),
    NULLIF(trim(payload->>'customer_last_name'), ''),
    trim(payload->>'customer_phone'),
    payload->'items',
    NULLIF(trim(payload->>'notes'), ''),
    delivery_method,
    COALESCE((payload->>'delivery_fee')::numeric, 0),
    NULLIF(trim(payload->>'delivery_address'), ''),
    NULLIF(trim(payload->>'locality'), ''),
    NULLIF(trim(payload->>'postal_code'), ''),
    NULLIF(trim(payload->>'apartment'), ''),
    NULLIF(trim(payload->>'cross_streets'), ''),
    NULLIF(trim(payload->>'delivery_notes'), ''),
    COALESCE((payload->>'subtotal')::numeric, 0),
    COALESCE((payload->>'total')::numeric, 0),
    COALESCE(NULLIF(trim(payload->>'payment_method'), ''), 'transfer'),
    COALESCE(NULLIF(trim(payload->>'payment_status'), ''), 'pending_receipt'),
    COALESCE(NULLIF(trim(payload->>'order_status'), ''), 'pending_payment')
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_public_order(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_public_order(jsonb) TO anon, authenticated;

-- Crear usuarios admin desde Supabase Dashboard:
-- Authentication > Users > Add user (email + password)
