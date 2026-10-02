erDiagram
    AUTH_USERS {
        uuid id PK
    }

    PROFILES {
        uuid id PK, FK
        user_role role
        text first_name
        text last_name
        varchar dni
        boolean dni_verified
        varchar phone
        boolean phone_verified
        account_status status
        varchar location
        numeric latitude
        numeric longitude
        boolean location_verified
        text avatar_url
        text cover_url
        text description
        boolean email_alerts
        boolean phone_alerts
        timestamptz created_at
        timestamptz updated_at
    }

    SERVICE_CATEGORIES {
        integer id PK
        text name UK
        text slug UK
        text icon
        boolean is_active
        timestamptz created_at
    }

    PROFESSIONAL_PROFILES {
        uuid profile_id PK, FK
        integer category_id FK
        text license_number
        numeric hourly_rate
        text headline
        jsonb skills
        text service_area
        numeric coverage_radius_km
        numeric latitude
        numeric longitude
        boolean is_verified
        numeric rating_avg
        integer reviews_count
        timestamptz created_at
        timestamptz updated_at
    }

    PROFESSIONAL_AVAILABILITY {
        uuid id PK
        uuid profile_id FK
        varchar day
        varchar time_range
    }

    PROFESSIONAL_CERTIFICATIONS {
        uuid id PK
        uuid profile_id FK
        text name
        text issuer
        text file_path
        boolean is_verified
        timestamptz created_at
    }

    REQUESTS {
        uuid id PK
        uuid client_id FK
        integer category_id FK
        text title
        text description
        request_status status
        date_preference date_preference
        text address
        text floor_apt
        text neighborhood
        text city
        numeric latitude
        numeric longitude
        numeric estimated_budget
        boolean is_emergency
        boolean has_materials
        text installation_age
        text time_preference
        timestamptz created_at
        timestamptz updated_at
    }

    REQUEST_PHOTOS {
        uuid id PK
        uuid request_id FK
        text storage_path
        smallint position
        timestamptz created_at
    }

    OFFERS {
        uuid id PK
        uuid request_id FK
        uuid professional_id FK
        numeric amount
        numeric proposed_deposit
        date proposed_date
        time proposed_time
        text message
        offer_status status
        timestamptz created_at
        timestamptz updated_at
    }

    APPOINTMENTS {
        uuid id PK
        uuid offer_id FK, UK
        timestamptz scheduled_at
        appointment_status status
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    PAYMENTS {
        uuid id PK
        uuid appointment_id FK, UK
        payment_method method
        numeric total_amount
        numeric deposit_amount
        numeric remaining_amount
        payment_status status
        text external_operation_id
        timestamptz created_at
        timestamptz updated_at
    }

    REVIEWS {
        uuid id PK
        uuid reviewer_id FK
        uuid reviewee_id FK
        smallint rating
        text comment
        timestamptz created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        varchar type
        text title
        text description
        boolean is_read
        uuid related_entity_id
        varchar related_entity_type
        jsonb metadata
        timestamptz created_at
    }

    ZONES {
        uuid id PK
        text name
        text city
        text province
        boolean active
    }

    AUTH_USERS ||--|| PROFILES : "tiene perfil"

    PROFILES ||--o| PROFESSIONAL_PROFILES : "puede ser profesional"
    SERVICE_CATEGORIES ||--o{ PROFESSIONAL_PROFILES : "clasifica"

    PROFESSIONAL_PROFILES ||--o{ PROFESSIONAL_AVAILABILITY : "define disponibilidad"
    PROFESSIONAL_PROFILES ||--o{ PROFESSIONAL_CERTIFICATIONS : "tiene certificaciones"

    PROFILES ||--o{ REQUESTS : "crea solicitudes"
    SERVICE_CATEGORIES ||--o{ REQUESTS : "categoriza"
    REQUESTS ||--o{ REQUEST_PHOTOS : "incluye fotos"

    REQUESTS ||--o{ OFFERS : "recibe ofertas"
    PROFILES ||--o{ OFFERS : "realiza como profesional"

    OFFERS ||--o| APPOINTMENTS : "genera cita"
    APPOINTMENTS ||--o| PAYMENTS : "tiene pago"

    PROFILES ||--o{ REVIEWS : "escribe reseñas"
    PROFILES ||--o{ REVIEWS : "recibe reseñas"

    PROFILES ||--o{ NOTIFICATIONS : "recibe notificaciones"