import { Medication, DoseLog } from "@/types";

// LocalStorageのキー
const MEDICATIONS_KEY = "medications";
const DOSE_LOGS_KEY = "doseLogs";

// ブラウザ環境かどうかのチェック
const isBrowser = typeof window !== "undefined";

/**
 * 薬のリストを取得
 */
export function getMedications(): Medication[] {
  if (!isBrowser) return [];

  try {
    const data = localStorage.getItem(MEDICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load medications:", error);
    return [];
  }
}

/**
 * 薬を保存
 */
export function saveMedications(medications: Medication[]): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (error) {
    console.error("Failed to save medications:", error);
  }
}

/**
 * 薬を追加
 */
export function addMedication(medication: Medication): void {
  const medications = getMedications();
  medications.push(medication);
  saveMedications(medications);
}

/**
 * 薬を更新
 */
export function updateMedication(id: string, updates: Partial<Medication>): void {
  const medications = getMedications();
  const index = medications.findIndex(m => m.id === id);

  if (index !== -1) {
    medications[index] = { ...medications[index], ...updates };
    saveMedications(medications);
  }
}

/**
 * 薬を削除
 */
export function deleteMedication(id: string): void {
  const medications = getMedications();
  const filtered = medications.filter(m => m.id !== id);
  saveMedications(filtered);

  // 関連する服薬記録も削除
  const logs = getDoseLogs();
  const filteredLogs = logs.filter(log => log.medId !== id);
  saveDoseLogs(filteredLogs);
}

/**
 * IDで薬を取得
 */
export function getMedicationById(id: string): Medication | undefined {
  const medications = getMedications();
  return medications.find(m => m.id === id);
}

/**
 * 服薬記録のリストを取得
 */
export function getDoseLogs(): DoseLog[] {
  if (!isBrowser) return [];

  try {
    const data = localStorage.getItem(DOSE_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load dose logs:", error);
    return [];
  }
}

/**
 * 服薬記録を保存
 */
export function saveDoseLogs(logs: DoseLog[]): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(DOSE_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to save dose logs:", error);
  }
}

/**
 * 服薬記録を追加
 */
export function addDoseLog(log: DoseLog): void {
  const logs = getDoseLogs();
  logs.push(log);
  saveDoseLogs(logs);
}

/**
 * 服薬記録を更新
 */
export function updateDoseLog(id: string, updates: Partial<DoseLog>): void {
  const logs = getDoseLogs();
  const index = logs.findIndex(l => l.id === id);

  if (index !== -1) {
    logs[index] = { ...logs[index], ...updates };
    saveDoseLogs(logs);
  }
}

/**
 * 特定の日付の服薬記録を取得
 */
export function getDoseLogsByDate(date: string): DoseLog[] {
  const logs = getDoseLogs();
  return logs.filter(log => log.scheduledDate === date);
}

/**
 * 特定の薬の服薬記録を取得
 */
export function getDoseLogsByMedId(medId: string): DoseLog[] {
  const logs = getDoseLogs();
  return logs.filter(log => log.medId === medId);
}

/**
 * ユニークIDを生成
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
