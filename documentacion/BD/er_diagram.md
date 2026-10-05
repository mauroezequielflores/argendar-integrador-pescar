erDiagram
    AUTH_USERS {
        uuid id PK
    }

    PROFILES {
        uuid id PK, FK
        user_role role
        text first_name
        text last_name
        text avatar_url
        text phone
        account_status status
        timestamptz created_at
        timestamptz updated_at
        varchar dni
        boolean dni_verified
        boolean phone_verified
        varchar location
        boolean location_verified
        boolean email_alerts
        boolean phone_alerts
        text cover_url
        text description
        numeric latitude
        numeric longitude
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
        text moderation_status
        bigint order_number
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
        text moderation_status
        bigint order_number
        timestamptz created_at
        timestamptz updated_at
    }

    APPOINTMENTS {
        uuid id PK
        uuid offer_id FK, UK
        timestamptz scheduled_at
        appointment_status status
        text moderation_status
        bigint order_number
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
        bigint transaction_number
        timestamptz created_at
        timestamptz updated_at
    }

    REVIEWS {
        uuid id PK
        uuid reviewer_id FK
        uuid reviewee_id FK
        smallint rating
        text comment
        text moderation_status
        bigint order_number
        timestamptz created_at
        uuid appointment_id FK, UK
        jsonb tags
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
        varchar href
    }

    ZONES {
        uuid id PK
        text name
        text city
        text province
        boolean active
    }

    SUPPORT_TICKETS {
        uuid id PK
        bigint ticket_number
        uuid user_id FK
        text subject
        text message
        text status
        text reply_subject
        text reply_message
        text replied_by
        timestamptz replied_at
        timestamptz created_at
    }

    AUTH_USERS ||--|| PROFILES : "cuenta de Auth"
    PROFILES ||--o| PROFESSIONAL_PROFILES : "perfil profesional"
    SERVICE_CATEGORIES ||--o{ PROFESSIONAL_PROFILES : "categoría"
    PROFESSIONAL_PROFILES ||--o{ PROFESSIONAL_AVAILABILITY : "disponibilidad"
    PROFESSIONAL_PROFILES ||--o{ PROFESSIONAL_CERTIFICATIONS : "certificaciones"

    PROFILES ||--o{ REQUESTS : "cliente"
    SERVICE_CATEGORIES ||--o{ REQUESTS : "categoría"
    REQUESTS ||--o{ REQUEST_PHOTOS : "fotos"
    REQUESTS ||--o{ OFFERS : "ofertas"
    PROFILES ||--o{ OFFERS : "profesional"

    OFFERS ||--o| APPOINTMENTS : "cita"
    APPOINTMENTS ||--o| PAYMENTS : "pago"
    APPOINTMENTS ||--o| REVIEWS : "reseña"

    PROFILES ||--o{ REVIEWS : "escribe"
    PROFILES ||--o{ REVIEWS : "recibe"
    PROFILES ||--o{ NOTIFICATIONS : "recibe"
    PROFILES ||--o{ SUPPORT_TICKETS : "crea consulta"


esquema Auth

erDiagram
    AUTH_USERS {
        uuid id PK
    }
    AUTH_IDENTITIES {
        uuid id PK
        uuid user_id FK
    }
    AUTH_SESSIONS {
        uuid id PK
        uuid user_id FK
        uuid oauth_client_id FK
    }
    AUTH_REFRESH_TOKENS {
        bigint id PK
        uuid session_id FK
    }
    AUTH_MFA_FACTORS {
        uuid id PK
        uuid user_id FK
    }
    AUTH_MFA_CHALLENGES {
        uuid id PK
        uuid factor_id FK
    }
    AUTH_MFA_AMR_CLAIMS {
        uuid id PK
        uuid session_id FK
    }
    AUTH_MFA_RECOVERY_CODE_SETS {
        uuid id PK
        uuid user_id FK
        uuid mfa_factor_id FK
    }
    AUTH_MFA_RECOVERY_CODES {
        uuid id PK
        uuid mfa_recovery_code_set_id FK
    }
    AUTH_ONE_TIME_TOKENS {
        uuid id PK
        uuid user_id FK
    }
    AUTH_WEBAUTHN_CREDENTIALS {
        uuid id PK
        uuid user_id FK
    }
    AUTH_WEBAUTHN_CHALLENGES {
        uuid id PK
        uuid user_id FK
    }
    AUTH_SSO_PROVIDERS {
        uuid id PK
    }
    AUTH_SSO_DOMAINS {
        uuid id PK
        uuid sso_provider_id FK
    }
    AUTH_SAML_PROVIDERS {
        uuid id PK
        uuid sso_provider_id FK
    }
    AUTH_SAML_RELAY_STATES {
        uuid id PK
        uuid sso_provider_id FK
        uuid flow_state_id FK
    }
    AUTH_FLOW_STATE {
        uuid id PK
    }
    AUTH_SCIM_USERS {
        uuid id PK
        uuid sso_provider_id FK
        uuid user_id FK
    }
    AUTH_SCIM_TOKENS {
        uuid id PK
        uuid sso_provider_id FK
    }
    AUTH_OAUTH_CLIENTS {
        uuid id PK
    }
    AUTH_OAUTH_AUTHORIZATIONS {
        uuid id PK
        uuid user_id FK
        uuid client_id FK
    }
    AUTH_OAUTH_CONSENTS {
        uuid id PK
        uuid user_id FK
        uuid client_id FK
    }
    AUTH_INSTANCES {
        uuid id PK
    }
    AUTH_AUDIT_LOG_ENTRIES {
        uuid id PK
    }
    AUTH_SCHEMA_MIGRATIONS {
        varchar version PK
    }
    AUTH_OAUTH_CLIENT_STATES {
        uuid id PK
    }
    AUTH_CUSTOM_OAUTH_PROVIDERS {
        uuid id PK
    }
    PUBLIC_PROFILES {
        uuid id PK, FK
    }

    AUTH_USERS ||--o{ AUTH_IDENTITIES : "identidades"
    AUTH_USERS ||--o{ AUTH_SESSIONS : "sesiones"
    AUTH_SESSIONS ||--o{ AUTH_REFRESH_TOKENS : "tokens"
    AUTH_USERS ||--o{ AUTH_MFA_FACTORS : "factores MFA"
    AUTH_MFA_FACTORS ||--o{ AUTH_MFA_CHALLENGES : "desafíos"
    AUTH_SESSIONS ||--o{ AUTH_MFA_AMR_CLAIMS : "métodos MFA"
    AUTH_USERS ||--o| AUTH_MFA_RECOVERY_CODE_SETS : "códigos de recuperación"
    AUTH_MFA_FACTORS ||--o| AUTH_MFA_RECOVERY_CODE_SETS : "factor asociado"
    AUTH_MFA_RECOVERY_CODE_SETS ||--o{ AUTH_MFA_RECOVERY_CODES : "códigos"
    AUTH_USERS ||--o{ AUTH_ONE_TIME_TOKENS : "tokens temporales"
    AUTH_USERS ||--o{ AUTH_WEBAUTHN_CREDENTIALS : "credenciales WebAuthn"
    AUTH_USERS ||--o{ AUTH_WEBAUTHN_CHALLENGES : "desafíos WebAuthn"

    AUTH_SSO_PROVIDERS ||--o{ AUTH_SSO_DOMAINS : "dominios"
    AUTH_SSO_PROVIDERS ||--o{ AUTH_SAML_PROVIDERS : "configuración SAML"
    AUTH_SSO_PROVIDERS ||--o{ AUTH_SAML_RELAY_STATES : "estados SAML"
    AUTH_FLOW_STATE ||--o{ AUTH_SAML_RELAY_STATES : "flujo"
    AUTH_SSO_PROVIDERS ||--o{ AUTH_SCIM_USERS : "usuarios SCIM"
    AUTH_SSO_PROVIDERS ||--o{ AUTH_SCIM_TOKENS : "tokens SCIM"
    AUTH_USERS ||--o{ AUTH_SCIM_USERS : "cuenta vinculada"

    AUTH_OAUTH_CLIENTS ||--o{ AUTH_SESSIONS : "cliente OAuth"
    AUTH_OAUTH_CLIENTS ||--o{ AUTH_OAUTH_AUTHORIZATIONS : "autorizaciones"
    AUTH_OAUTH_CLIENTS ||--o{ AUTH_OAUTH_CONSENTS : "consentimientos"
    AUTH_USERS ||--o{ AUTH_OAUTH_AUTHORIZATIONS : "usuario"
    AUTH_USERS ||--o{ AUTH_OAUTH_CONSENTS : "usuario"

    AUTH_USERS ||--|| PUBLIC_PROFILES : "perfil de la aplicación"


Storage, realtime y vault

erDiagram
    STORAGE_BUCKETS {
        text id PK
    }
    STORAGE_OBJECTS {
        uuid id PK
        text bucket_id FK
    }
    STORAGE_S3_MULTIPART_UPLOADS {
        text id PK
        text bucket_id FK
    }
    STORAGE_S3_MULTIPART_UPLOADS_PARTS {
        uuid id PK
        text bucket_id FK
        text upload_id FK
    }
    STORAGE_BUCKETS_ANALYTICS {
        uuid id PK
    }
    STORAGE_BUCKETS_VECTORS {
        text id PK
    }
    STORAGE_VECTOR_INDEXES {
        text id PK
        text bucket_id FK
    }
    STORAGE_MIGRATIONS {
        integer id PK
    }

    REALTIME_MESSAGES {
        uuid id PK
        timestamptz inserted_at PK
    }
    REALTIME_SUBSCRIPTION {
        bigint id PK
    }
    REALTIME_SCHEMA_MIGRATIONS {
        bigint version PK
    }

    VAULT_SECRETS {
        uuid id PK
    }

    STORAGE_BUCKETS ||--o{ STORAGE_OBJECTS : "contiene"
    STORAGE_BUCKETS ||--o{ STORAGE_S3_MULTIPART_UPLOADS : "subidas"
    STORAGE_BUCKETS ||--o{ STORAGE_S3_MULTIPART_UPLOADS_PARTS : "partes"
    STORAGE_S3_MULTIPART_UPLOADS ||--o{ STORAGE_S3_MULTIPART_UPLOADS_PARTS : "partes de subida"
    STORAGE_BUCKETS_VECTORS ||--o{ STORAGE_VECTOR_INDEXES : "índices"