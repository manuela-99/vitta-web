-- Políticas RLS para public.orders
-- Ejecutar en el SQL Editor de Supabase antes de usar el panel admin.

alter table public.orders enable row level security;

-- Checkout público: insertar pedidos sin autenticación
drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders"
on public.orders
for insert
to anon, authenticated
with check (true);

-- Panel admin: leer pedidos solo usuarios autenticados
drop policy if exists "Authenticated can read orders" on public.orders;
create policy "Authenticated can read orders"
on public.orders
for select
to authenticated
using (true);

-- Panel admin: actualizar estados solo usuarios autenticados
drop policy if exists "Authenticated can update orders" on public.orders;
create policy "Authenticated can update orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

-- Crear usuarios admin desde Supabase Dashboard:
-- Authentication > Users > Add user (email + password)
