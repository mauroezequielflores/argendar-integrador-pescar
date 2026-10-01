export const formatDatePreference = (preference) => {
  const map = {
    this_week: "Esta semana",
    urgent: "Lo antes posible",
    flexible: "Soy flexible",
    this_month: "Este fin de semana"
  };
  return map[preference] || preference;
};

// If the URL is just a path from Supabase storage (requests/id_img.jpg), convert to full public URL.
// If it's already a full URL or base64, return as is.
export const getSupabasePublicUrl = (path, bucket = 'request-photos') => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  // Base URL from env or hardcoded fallback for Supabase Storage
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }
  return path;
};
