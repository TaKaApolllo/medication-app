"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Medication, DoseLog } from '@/types';
import * as localStorage from '@/lib/storage';
import * as supabaseApi from '@/lib/supabase/api';

/**
 * Unified data access hook
 * Automatically uses Supabase when authenticated, LocalStorage otherwise
 */
export function useData() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // ==================== Medications ====================

  const getMedications = async (): Promise<Medication[]> => {
    if (isAuthenticated) {
      return await supabaseApi.getMedications();
    }
    return localStorage.getMedications();
  };

  const getMedicationById = async (id: string): Promise<Medication | null> => {
    if (isAuthenticated) {
      return await supabaseApi.getMedicationById(id);
    }
    return localStorage.getMedicationById(id);
  };

  const addMedication = async (
    medication: Omit<Medication, 'id' | 'createdAt'>
  ): Promise<Medication> => {
    if (isAuthenticated) {
      return await supabaseApi.addMedication(medication);
    }
    return localStorage.addMedication(medication);
  };

  const updateMedication = async (
    id: string,
    updates: Partial<Omit<Medication, 'id' | 'createdAt'>>
  ): Promise<Medication> => {
    if (isAuthenticated) {
      return await supabaseApi.updateMedication(id, updates);
    }
    return localStorage.updateMedication(id, updates);
  };

  const deleteMedication = async (id: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseApi.deleteMedication(id);
    } else {
      localStorage.deleteMedication(id);
    }
  };

  // ==================== Dose Logs ====================

  const getDoseLogs = async (
    startDate?: string,
    endDate?: string
  ): Promise<DoseLog[]> => {
    if (isAuthenticated) {
      return await supabaseApi.getDoseLogs(startDate, endDate);
    }
    return localStorage.getDoseLogs();
  };

  const getDoseLogsByMedId = async (medId: string): Promise<DoseLog[]> => {
    if (isAuthenticated) {
      return await supabaseApi.getDoseLogsByMedId(medId);
    }
    const allLogs = localStorage.getDoseLogs();
    return allLogs.filter(log => log.medId === medId);
  };

  const addDoseLog = async (log: Omit<DoseLog, 'id'>): Promise<DoseLog> => {
    if (isAuthenticated) {
      return await supabaseApi.addDoseLog(log);
    }
    return localStorage.addDoseLog(log);
  };

  const updateDoseLog = async (
    id: string,
    updates: Partial<Omit<DoseLog, 'id' | 'medId' | 'scheduledDate' | 'scheduledTime'>>
  ): Promise<DoseLog> => {
    if (isAuthenticated) {
      return await supabaseApi.updateDoseLog(id, updates);
    }
    return localStorage.updateDoseLog(id, updates);
  };

  const deleteDoseLog = async (id: string): Promise<void> => {
    if (isAuthenticated) {
      await supabaseApi.deleteDoseLog(id);
    } else {
      localStorage.deleteDoseLog(id);
    }
  };

  const clearAllData = async (): Promise<void> => {
    if (isAuthenticated) {
      // Delete all medications (cascade will delete dose logs)
      const medications = await supabaseApi.getMedications();
      await Promise.all(medications.map(med => supabaseApi.deleteMedication(med.id)));
    } else {
      localStorage.clearAllData();
    }
  };

  return {
    isAuthenticated,
    // Medications
    getMedications,
    getMedicationById,
    addMedication,
    updateMedication,
    deleteMedication,
    // Dose Logs
    getDoseLogs,
    getDoseLogsByMedId,
    addDoseLog,
    updateDoseLog,
    deleteDoseLog,
    // Utility
    clearAllData,
  };
}
