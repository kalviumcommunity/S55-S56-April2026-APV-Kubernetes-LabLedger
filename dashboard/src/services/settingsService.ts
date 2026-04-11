import { supabase } from '../lib/supabase';

export interface UserProfile {
  id?: number;
  full_name: string;
  email: string;
  role: string;
}

const TABLE_NAME = 'profiles';

export const settingsService = {
  /**
   * Fetches the lab profile. 
   * Defaults to a mock if the table doesn't exist yet (progressive enhancement).
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found, return default
          return { full_name: 'Dr. Pranjal', email: 'director@labledger.ai', role: 'Lab Director' };
        }
        throw error;
      }

      return data as UserProfile;
    } catch (err) {
      console.warn('Profiles table not ready, using default:', err);
      return { full_name: 'Dr. Pranjal', email: 'director@labledger.ai', role: 'Lab Director' };
    }
  },

  /**
   * Updates the lab profile record.
   */
  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    // 1. First, check if there's any record in the table
    const { data: existing } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .limit(1)
      .single();

    let result;
    
    if (existing) {
      // 2. Perform an UPDATE by ID (safe from identity constraint errors)
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          full_name: profile.full_name,
          email: profile.email,
          role: profile.role
        })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // 3. Perform an INSERT (PostgreSQL will generate the ID automatically)
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert({
          full_name: profile.full_name,
          email: profile.email,
          role: profile.role
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return result as UserProfile;
  }
};
