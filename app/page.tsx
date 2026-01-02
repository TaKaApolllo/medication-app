"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BigButton from "@/components/BigButton";
import Card from "@/components/Card";
import { Medication, DoseLog } from "@/types";
import {
  getMedications,
  addDoseLog,
  getDoseLogsByDate,
  generateId,
} from "@/lib/storage";
import { getTodayDate, getCurrentTime, formatDateJa } from "@/lib/dateUtils";
import { getNextDose, getTodaySummary } from "@/lib/scheduleUtils";

export default function Home() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [nextDose, setNextDose] = useState<ReturnType<typeof getNextDose>>(null);
  const [summary, setSummary] = useState<ReturnType<typeof getTodaySummary>>({
    total: 0,
    taken: 0,
    missed: 0,
    upcoming: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // データ読み込み
  const loadData = () => {
    const meds = getMedications();
    setMedications(meds);
    setNextDose(getNextDose(meds));
    setSummary(getTodaySummary(meds));
  };

  useEffect(() => {
    loadData();
  }, []);

  // 「飲んだ」ボタンを押したときの処理
  const handleTakeMedication = () => {
    if (!nextDose) return;

    const today = getTodayDate();
    const logs = getDoseLogsByDate(today);

    // すでに記録されているかチェック
    const existingLog = logs.find(
      (log) =>
        log.medId === nextDose.medication.id &&
        log.scheduledTime === nextDose.scheduledTime
    );

    if (existingLog) {
      alert("すでに記録されています");
      return;
    }

    // 新しい記録を作成
    const newLog: DoseLog = {
      id: generateId(),
      medId: nextDose.medication.id,
      scheduledDate: today,
      scheduledTime: nextDose.scheduledTime,
      takenAt: new Date().toISOString(),
      status: "taken",
    };

    addDoseLog(newLog);

    // 成功メッセージ表示
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // データ再読み込み
    loadData();
  };

  const today = getTodayDate();

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-600">
          服薬管理
        </h1>

        {/* 今日の日付 */}
        <div className="text-center mb-6">
          <p className="text-2xl font-medium text-gray-700">
            {formatDateJa(today)}
          </p>
        </div>

        {/* 成功メッセージ */}
        {showSuccess && (
          <Card className="mb-6 bg-green-50 border-2 border-green-500">
            <p className="text-2xl text-center text-green-700 font-bold">
              ✓ 記録しました！
            </p>
          </Card>
        )}

        {/* 薬が登録されていない場合 */}
        {medications.length === 0 ? (
          <Card className="mb-6">
            <p className="text-xl text-center text-gray-600 mb-4">
              まだお薬が登録されていません
            </p>
            <Link href="/meds/new">
              <BigButton variant="primary" className="w-full">
                お薬を登録する
              </BigButton>
            </Link>
          </Card>
        ) : (
          <>
            {/* 次の服薬 */}
            {nextDose ? (
              <Card className="mb-6 bg-blue-50 border-2 border-blue-500">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                  次に飲むお薬
                </h2>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {nextDose.scheduledTime}
                  </p>
                  <p className="text-2xl text-gray-800 mb-1">
                    {nextDose.medication.name}
                  </p>
                  <p className="text-xl text-gray-600">
                    {nextDose.medication.dosage}
                  </p>
                  {nextDose.medication.instructions && (
                    <p className="text-lg text-gray-500 mt-2">
                      {nextDose.medication.instructions}
                    </p>
                  )}
                </div>
                <BigButton
                  variant="success"
                  className="w-full"
                  onClick={handleTakeMedication}
                >
                  飲んだ
                </BigButton>
              </Card>
            ) : (
              <Card className="mb-6 bg-gray-50">
                <p className="text-2xl text-center text-gray-600">
                  今日の服薬はすべて完了しました
                </p>
              </Card>
            )}

            {/* 今日の状況 */}
            <Card className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                今日の状況
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-lg text-gray-600 mb-1">飲んだ</p>
                  <p className="text-4xl font-bold text-green-600">
                    {summary.taken}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-600 mb-1">これから</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {summary.upcoming}
                  </p>
                </div>
              </div>
              {summary.missed > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-lg text-red-600 mb-1">飲み忘れ</p>
                  <p className="text-4xl font-bold text-red-600">
                    {summary.missed}
                  </p>
                </div>
              )}
            </Card>

            {/* お薬管理へのリンク */}
            <Link href="/meds">
              <BigButton variant="secondary" className="w-full mb-4">
                お薬を管理する
              </BigButton>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
