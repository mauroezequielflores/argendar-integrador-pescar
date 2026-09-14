import { supabase, createThrowawayClient } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided or invalid format', 401));
    }

    const token = authHeader.split(' ')[1];
    
    // Validate token with Supabase using a throwaway client to prevent RLS bleeding
    const tempSupabase = createThrowawayClient();
    const { data: { user }, error: authError } = await tempSupabase.auth.getUser(token);
    
    if (authError || !user) {
      return next(new AppError('Invalid or expired token', 401));
    }

    // Fetch user profile to get the role and ensure it exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('AuthMiddleware Profile Error:', profileError, 'for user:', user.id);
      return next(new AppError('User profile not found', 404));
    }

    req.user = {
      id: profile.id,
      role: profile.role,
      email: user.email
    };

    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};
