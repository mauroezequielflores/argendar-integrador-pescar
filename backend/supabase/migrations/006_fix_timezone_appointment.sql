-- Drop the existing function first to ensure return types and arguments match if anything changed
DROP FUNCTION IF EXISTS public.accept_offer_and_schedule(UUID);

CREATE OR REPLACE FUNCTION public.accept_offer_and_schedule(
  p_offer_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_id UUID;
  v_professional_id UUID;
  v_amount NUMERIC;
  v_deposit NUMERIC;
  v_appointment_id UUID;
  v_client_id UUID;
  v_proposed_date DATE;
  v_proposed_time TIME;
  v_scheduled_at TIMESTAMPTZ;
BEGIN
  -- Get offer details
  SELECT request_id, professional_id, amount, proposed_deposit, proposed_date, proposed_time
  INTO v_request_id, v_professional_id, v_amount, v_deposit, v_proposed_date, v_proposed_time
  FROM public.offers
  WHERE id = p_offer_id;

  -- Update accepted offer
  UPDATE public.offers
  SET status = 'accepted', updated_at = NOW()
  WHERE id = p_offer_id;

  -- Reject other offers for the same request
  UPDATE public.offers
  SET status = 'rejected', updated_at = NOW()
  WHERE request_id = v_request_id AND id != p_offer_id;

  -- Update request status
  UPDATE public.requests
  SET status = 'scheduled', updated_at = NOW()
  WHERE id = v_request_id;
  
  -- Calculate timestamp in local timezone (Argentina) and store as TIMESTAMPTZ
  v_scheduled_at := (v_proposed_date + v_proposed_time) AT TIME ZONE 'America/Argentina/Buenos_Aires';

  -- Create appointment
  INSERT INTO public.appointments (
    offer_id,
    scheduled_at,
    status
  ) VALUES (
    p_offer_id,
    v_scheduled_at,
    'confirmed'
  ) RETURNING id INTO v_appointment_id;

  -- Create payment
  INSERT INTO public.payments (
    appointment_id,
    total_amount,
    deposit_amount,
    method,
    status
  ) VALUES (
    v_appointment_id,
    v_amount,
    v_deposit,
    'mercadopago', 
    'pending'
  );

  -- Get client id
  SELECT client_id INTO v_client_id FROM public.requests WHERE id = v_request_id;

  -- Notify professional
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    description,
    related_entity_id,
    related_entity_type
  ) VALUES (
    v_professional_id,
    'offer_accepted',
    '¡Oferta Aceptada!',
    'El cliente ha aceptado tu oferta.',
    v_appointment_id,
    'appointment'
  );

  -- Notify client
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    description,
    related_entity_id,
    related_entity_type
  ) VALUES (
    v_client_id,
    'offer_accepted',
    'Turno Confirmado',
    'Has aceptado la oferta y el turno está agendado.',
    v_appointment_id,
    'appointment'
  );

  RETURN v_appointment_id;
END;
$$;
