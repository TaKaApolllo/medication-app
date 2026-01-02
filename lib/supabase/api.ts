import { supabase } from './client';
import { Medication, DoseLog, DoseStatus } from '@/types';

// ==================== Medications ====================

export async function getMedications(): Promise<Medication[]> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    dosage: row.dosage,
    times: row.times,
    instructions: row.instructions || undefined,
    photoUrl: row.photo_url || undefined,
    createdAt: row.created_at,
  }));
}

export async function getMedicationById(id: string): Promise<Medication | null> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    dosage: data.dosage,
    times: data.times,
    instructions: data.instructions || undefined,
    photoUrl: data.photo_url || undefined,
    createdAt: data.created_at,
  };
}

export async function addMedication(
  medication: Omit<Medication, 'id' | 'createdAt'>
): Promise<Medication> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('medications')
    .insert({
      user_id: user.id,
      name: medication.name,
      dosage: medication.dosage,
      times: medication.times,
      instructions: medication.instructions || null,
      photo_url: medication.photoUrl || null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    dosage: data.dosage,
    times: data.times,
    instructions: data.instructions || undefined,
    photoUrl: data.photo_url || undefined,
    createdAt: data.created_at,
  };
}

export async function updateMedication(
  id: string,
  updates: Partial<Omit<Medication, 'id' | 'createdAt'>>
): Promise<Medication> {
  const { data, error } = await supabase
    .from('medications')
    .update({
      name: updates.name,
      dosage: updates.dosage,
      times: updates.times,
      instructions: updates.instructions || null,
      photo_url: updates.photoUrl || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    dosage: data.dosage,
    times: data.times,
    instructions: data.instructions || undefined,
    photoUrl: data.photo_url || undefined,
    createdAt: data.created_at,
  };
}

export async function deleteMedication(id: string): Promise<void> {
  const { error } = await supabase
    .from('medications')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== Dose Logs ====================

export async function getDoseLogs(
  startDate?: string,
  endDate?: string
): Promise<DoseLog[]> {
  let query = supabase
    .from('dose_logs')
    .select('*')
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false });

  if (startDate) {
    query = query.gte('scheduled_date', startDate);
  }
  if (endDate) {
    query = query.lte('scheduled_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    medId: row.med_id,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    takenAt: row.taken_at || undefined,
    status: row.status as DoseStatus,
  }));
}

export async function getDoseLogsByMedId(medId: string): Promise<DoseLog[]> {
  const { data, error } = await supabase
    .from('dose_logs')
    .select('*')
    .eq('med_id', medId)
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    medId: row.med_id,
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    takenAt: row.taken_at || undefined,
    status: row.status as DoseStatus,
  }));
}

export async function addDoseLog(
  log: Omit<DoseLog, 'id'>
): Promise<DoseLog> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('dose_logs')
    .insert({
      user_id: user.id,
      med_id: log.medId,
      scheduled_date: log.scheduledDate,
      scheduled_time: log.scheduledTime,
      taken_at: log.takenAt || null,
      status: log.status,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    medId: data.med_id,
    scheduledDate: data.scheduled_date,
    scheduledTime: data.scheduled_time,
    takenAt: data.taken_at || undefined,
    status: data.status as DoseStatus,
  };
}

export async function updateDoseLog(
  id: string,
  updates: Partial<Omit<DoseLog, 'id' | 'medId' | 'scheduledDate' | 'scheduledTime'>>
): Promise<DoseLog> {
  const { data, error } = await supabase
    .from('dose_logs')
    .update({
      taken_at: updates.takenAt || null,
      status: updates.status,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    medId: data.med_id,
    scheduledDate: data.scheduled_date,
    scheduledTime: data.scheduled_time,
    takenAt: data.taken_at || undefined,
    status: data.status as DoseStatus,
  };
}

export async function deleteDoseLog(id: string): Promise<void> {
  const { error } = await supabase
    .from('dose_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== Helper Functions ====================

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}
