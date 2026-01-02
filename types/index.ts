// 薬の情報
export interface Medication {
  id: string;
  name: string; // 薬の名前
  dosage: string; // 用量（例: "1錠", "10mg"）
  times: string[]; // 服薬時刻（例: ["08:00", "12:00", "20:00"]）
  instructions?: string; // メモ・注意事項
  photoUrl?: string; // 写真のURL（Phase 2で使用）
  createdAt: string; // 作成日時（ISO 8601形式）
}

// 服薬記録のステータス
export type DoseStatus = "taken" | "missed" | "skipped";

// 服薬記録
export interface DoseLog {
  id: string;
  medId: string; // 対応するMedicationのID
  scheduledDate: string; // 予定日（YYYY-MM-DD形式）
  scheduledTime: string; // 予定時刻（HH:MM形式）
  takenAt?: string; // 実際に飲んだ日時（ISO 8601形式）
  status: DoseStatus; // ステータス
}

// 次に飲む薬の情報（ホーム画面表示用）
export interface NextDose {
  medication: Medication;
  scheduledTime: string;
  scheduledDate: string;
}

// 今日の服薬状況サマリー（ホーム画面表示用）
export interface TodaySummary {
  total: number; // 今日の服薬予定数
  taken: number; // 飲んだ数
  missed: number; // 飲み忘れ数
  upcoming: number; // これから飲む数
}
