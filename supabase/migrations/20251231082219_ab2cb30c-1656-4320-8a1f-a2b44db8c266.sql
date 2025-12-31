-- Fix: Do not trust client-provided order totals; compute totals server-side.

-- 1) On order INSERT, always set a safe initial total (shipping only).
CREATE OR REPLACE FUNCTION public.set_order_total_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Initial total is shipping only; the final total is computed from order_items once items are inserted.
  NEW.total := 10.00;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_order_total_on_insert_trigger ON public.orders;
CREATE TRIGGER set_order_total_on_insert_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.set_order_total_on_insert();


-- 2) Helper: compute order total from authoritative catalog prices.
CREATE OR REPLACE FUNCTION public.calculate_order_total_from_items(_order_id uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    (COALESCE(SUM(oi.quantity * p.price), 0)::numeric + 10.00::numeric)
  FROM public.order_items oi
  JOIN public.products p ON p.id = oi.product_id
  WHERE oi.order_id = _order_id;
$$;


-- 3) Recalculate order total whenever order_items change.
CREATE OR REPLACE FUNCTION public.recalculate_order_total_from_items_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
SET row_security TO off
AS $$
DECLARE
  v_order_id uuid;
  v_total numeric;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  IF v_order_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  v_total := public.calculate_order_total_from_items(v_order_id);

  UPDATE public.orders
  SET total = v_total
  WHERE id = v_order_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS order_items_recalculate_order_total_trigger ON public.order_items;
CREATE TRIGGER order_items_recalculate_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_order_total_from_items_trigger();
