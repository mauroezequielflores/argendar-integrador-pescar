-- ============================================================================
-- Argendar — Mock Data para probar el Marketplace Profesional
-- Inserta solicitudes de prueba utilizando un cliente y categorías existentes.
-- ============================================================================

DO $$
DECLARE
    v_client_id uuid;
    v_plomeria_id integer;
    v_electricidad_id integer;
BEGIN
    -- Obtener el primer cliente disponible
    SELECT id INTO v_client_id FROM profiles WHERE role = 'client' LIMIT 1;

    -- Si no hay cliente, abortar con un mensaje claro
    IF v_client_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró ningún cliente en la tabla profiles. Registra un cliente primero.';
    END IF;

    -- Obtener IDs de categorías
    SELECT id INTO v_plomeria_id FROM service_categories WHERE slug = 'plomeria' LIMIT 1;
    SELECT id INTO v_electricidad_id FROM service_categories WHERE slug = 'electricidad' LIMIT 1;

    -- Insertar Solicitud 1 (Plomería)
    IF v_plomeria_id IS NOT NULL THEN
        INSERT INTO requests (
            client_id, category_id, title, description, status, date_preference, 
            address, neighborhood, city, is_emergency, has_materials, 
            installation_age, time_preference
        ) VALUES (
            v_client_id, v_plomeria_id, 
            'Reparación de pérdida en caño principal', 
            'Hay una pérdida constante de agua debajo de la mesada de la cocina. El agua se filtra por el mueble y está empezando a dañar la madera. Parece ser el caño principal que conecta con la red del edificio. Necesito un profesional con herramientas para soldar termofusión si fuera necesario.',
            'open', 'flexible',
            'Av. Rivadavia 4500', 'Caballito', 'CABA',
            true, false, 'No estoy seguro', 'Lo antes posible'
        );
    END IF;

    -- Insertar Solicitud 2 (Electricidad)
    IF v_electricidad_id IS NOT NULL THEN
        INSERT INTO requests (
            client_id, category_id, title, description, status, date_preference, 
            address, neighborhood, city, is_emergency, has_materials, 
            installation_age, time_preference
        ) VALUES (
            v_client_id, v_electricidad_id, 
            'Cortocircuito en tablero principal', 
            'Saltó la térmica principal y no puedo volver a dar luz. Hay olor a quemado cerca del tablero. Necesito alguien que lo revise de urgencia.',
            'open', 'urgent',
            'Corrientes 1234', 'San Nicolás', 'CABA',
            true, false, 'Más de 10 años', 'Cualquier horario'
        );
    END IF;

END $$;
