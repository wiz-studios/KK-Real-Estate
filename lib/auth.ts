import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { User } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for public operations
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password with hash
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Register new user (admin only in our system)
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          full_name: fullName,
          phone,
          role: 'user',
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    return { 
      user: formatUserResponse(data), 
      error: null 
    };
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    };
  }
}

// Create admin user
export async function createAdminUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          full_name: fullName,
          phone,
          role: 'admin',
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    return { 
      user: formatUserResponse(data), 
      error: null 
    };
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Admin creation failed' 
    };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { user: null, error: 'User not found' };
    }

    const passwordMatch = await comparePasswords(password, data.password_hash);

    if (!passwordMatch) {
      return { user: null, error: 'Invalid password' };
    }

    return { 
      user: formatUserResponse(data), 
      error: null 
    };
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return formatUserResponse(data);
  } catch {
    return null;
  }
}

// Format user response (map snake_case to camelCase)
export function formatUserResponse(user: any): User {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

// Middleware to check admin role
export async function requireAdmin(userId: string): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

// Create session token (JWT-like)
export async function createSessionToken(userId: string): Promise<string> {
  // In production, use proper JWT tokens
  // For now, just return a simple token
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}
