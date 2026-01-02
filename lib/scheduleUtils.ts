import { Medication, DoseLog, NextDose, TodaySummary } from "@/types";
import {
  getTodayDate,
  getCurrentTime,
  compareTime,
  isTimePassed,
} from "./dateUtils";
import { getDoseLogsByDate } from "./storage";

/**
 * 今日の服薬スケジュールを取得
 * 各薬の各時刻に対して、DoseLogを作成または取得
 */
export interface TodayScheduleItem {
  medication: Medication;
  scheduledTime: string;
  doseLog?: DoseLog;
}

export function getTodaySchedule(medications: Medication[]): TodayScheduleItem[] {
  const today = getTodayDate();
  const todayLogs = getDoseLogsByDate(today);

  const schedule: TodayScheduleItem[] = [];

  medications.forEach((med) => {
    med.times.forEach((time) => {
      // この薬・時刻に対応するログを探す
      const log = todayLogs.find(
        (l) => l.medId === med.id && l.scheduledTime === time
      );

      schedule.push({
        medication: med,
        scheduledTime: time,
        doseLog: log,
      });
    });
  });

  // 時刻順にソート
  schedule.sort((a, b) => compareTime(a.scheduledTime, b.scheduledTime));

  return schedule;
}

/**
 * 次に飲む薬を取得
 * まだ飲んでいない、かつ最も時刻が近いものを返す
 */
export function getNextDose(medications: Medication[]): NextDose | null {
  const schedule = getTodaySchedule(medications);
  const currentTime = getCurrentTime();

  // まだ飲んでいない、かつこれからの時刻
  const upcoming = schedule.filter((item) => {
    // すでに飲んだものは除外
    if (item.doseLog?.status === "taken") {
      return false;
    }
    // 過去の時刻は除外（まだ飲んでいなくても）
    // ※ただし、飲み忘れとして表示したい場合は条件を変更
    return compareTime(item.scheduledTime, currentTime) >= 0;
  });

  if (upcoming.length === 0) {
    return null;
  }

  const next = upcoming[0];
  return {
    medication: next.medication,
    scheduledTime: next.scheduledTime,
    scheduledDate: getTodayDate(),
  };
}

/**
 * 今日の服薬状況サマリーを取得
 */
export function getTodaySummary(medications: Medication[]): TodaySummary {
  const schedule = getTodaySchedule(medications);
  const currentTime = getCurrentTime();

  let taken = 0;
  let missed = 0;
  let upcoming = 0;

  schedule.forEach((item) => {
    if (item.doseLog?.status === "taken") {
      taken++;
    } else if (isTimePassed(item.scheduledTime)) {
      // 時刻が過ぎているのに飲んでいない
      missed++;
    } else {
      // これから飲む予定
      upcoming++;
    }
  });

  return {
    total: schedule.length,
    taken,
    missed,
    upcoming,
  };
}
