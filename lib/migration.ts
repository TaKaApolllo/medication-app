import { getMedications as getLocalMedications, getDoseLogs as getLocalDoseLogs } from './storage';
import { addMedication, addDoseLog, isAuthenticated } from './supabase/api';
import { Medication, DoseLog } from '@/types';

export interface MigrationResult {
  success: boolean;
  medicationsMigrated: number;
  doseLogsMigrated: number;
  errors: string[];
}

/**
 * Migrate all data from LocalStorage to Supabase
 */
export async function migrateToSupabase(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    medicationsMigrated: 0,
    doseLogsMigrated: 0,
    errors: [],
  };

  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      result.errors.push('ユーザーがログインしていません');
      return result;
    }

    // Get LocalStorage data
    const localMedications = getLocalMedications();
    const localDoseLogs = getLocalDoseLogs();

    // Migrate medications
    const medicationIdMap = new Map<string, string>(); // oldId -> newId

    for (const med of localMedications) {
      try {
        const { id: oldId, createdAt, ...medData } = med;
        const newMed = await addMedication(medData);
        medicationIdMap.set(oldId, newMed.id);
        result.medicationsMigrated++;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`薬「${med.name}」の移行に失敗: ${message}`);
      }
    }

    // Migrate dose logs with updated medication IDs
    for (const log of localDoseLogs) {
      try {
        const newMedId = medicationIdMap.get(log.medId);
        if (!newMedId) {
          result.errors.push(`服薬記録（ID: ${log.id}）の薬が見つかりません`);
          continue;
        }

        const { id, medId, ...logData } = log;
        await addDoseLog({
          ...logData,
          medId: newMedId,
        });
        result.doseLogsMigrated++;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`服薬記録の移行に失敗: ${message}`);
      }
    }

    result.success = result.errors.length === 0 ||
                     (result.medicationsMigrated > 0 || result.doseLogsMigrated > 0);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`移行処理でエラーが発生: ${message}`);
    return result;
  }
}

/**
 * Check if LocalStorage has any data to migrate
 */
export function hasLocalData(): boolean {
  const medications = getLocalMedications();
  const doseLogs = getLocalDoseLogs();
  return medications.length > 0 || doseLogs.length > 0;
}

/**
 * Clear all LocalStorage data after successful migration
 */
export function clearLocalData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('medications');
  localStorage.removeItem('doseLogs');
}

/**
 * Get summary of LocalStorage data
 */
export function getLocalDataSummary(): {
  medicationsCount: number;
  doseLogsCount: number;
} {
  const medications = getLocalMedications();
  const doseLogs = getLocalDoseLogs();

  return {
    medicationsCount: medications.length,
    doseLogsCount: doseLogs.length,
  };
}
