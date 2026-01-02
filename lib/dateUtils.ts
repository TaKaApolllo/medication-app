/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export function getTodayDate(): string {
  const now = new Date();
  return formatDate(now);
}

/**
 * Date を YYYY-MM-DD 形式にフォーマット
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 現在の時刻を HH:MM 形式で取得
 */
export function getCurrentTime(): string {
  const now = new Date();
  return formatTime(now);
}

/**
 * Date を HH:MM 形式にフォーマット
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * 日付文字列を日本語表記に変換
 * 例: "2024-01-15" → "2024年1月15日"
 */
export function formatDateJa(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 時刻文字列を比較（HH:MM形式）
 * time1 < time2 なら -1
 * time1 === time2 なら 0
 * time1 > time2 なら 1
 */
export function compareTime(time1: string, time2: string): number {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);

  if (h1 !== h2) {
    return h1 < h2 ? -1 : 1;
  }
  if (m1 !== m2) {
    return m1 < m2 ? -1 : 1;
  }
  return 0;
}

/**
 * 時刻が過ぎたかどうかを判定
 */
export function isTimePassed(time: string): boolean {
  const currentTime = getCurrentTime();
  return compareTime(time, currentTime) < 0;
}

/**
 * 日付と時刻から ISO 8601 形式の文字列を生成
 */
export function createDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

/**
 * ISO 8601 形式の文字列を日本語表記に変換
 * 例: "2024-01-15T08:00:00.000Z" → "2024年1月15日 8時0分"
 */
export function formatDateTimeJa(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
}
