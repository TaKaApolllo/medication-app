"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import { DoseLog, Medication } from "@/types";
import { useData } from "@/hooks/useData";
import { formatDate, formatDateJa } from "@/lib/dateUtils";

interface DayLog {
  date: string;
  logs: {
    log: DoseLog;
    medication: Medication | undefined;
  }[];
}

export default function HistoryPage() {
  const { getMedications, getDoseLogs } = useData();
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const medications = await getMedications();
        const allLogs = await getDoseLogs();

        // 過去7日間の日付を生成
        const dates: string[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dates.push(formatDate(date));
        }

        // 日付ごとにログをグループ化
        const grouped: DayLog[] = dates.map((date) => {
          const logsForDate = allLogs.filter((log) => log.scheduledDate === date);
          return {
            date,
            logs: logsForDate.map((log) => ({
              log,
              medication: medications.find((m) => m.id === log.medId),
            })),
          };
        });

        setDayLogs(grouped);
      } catch (error) {
        console.error("履歴の読み込みに失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      case "skipped":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "taken":
        return "✓ 飲んだ";
      case "missed":
        return "✗ 飲み忘れ";
      case "skipped":
        return "- スキップ";
      default:
        return "?";
    }
  };

  const getDateLabel = (date: string) => {
    const today = formatDate(new Date());
    const yesterday = formatDate(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );

    if (date === today) return "今日";
    if (date === yesterday) return "昨日";
    return formatDateJa(date);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="服薬履歴" subtitle="過去7日間の記録" />

        {loading ? (
          <Card>
            <p className="text-xl text-center text-gray-600">
              読み込み中...
            </p>
          </Card>
        ) : dayLogs.length === 0 ? (
          <Card>
            <p className="text-xl text-center text-gray-600">
              まだ記録がありません
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {dayLogs.map((dayLog) => (
              <Card key={dayLog.date}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {getDateLabel(dayLog.date)}
                </h3>

                {dayLog.logs.length === 0 ? (
                  <p className="text-lg text-gray-500">記録なし</p>
                ) : (
                  <div className="space-y-3">
                    {dayLog.logs.map((item) => (
                      <div
                        key={item.log.id}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xl font-medium text-gray-800">
                            {item.log.scheduledTime}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              item.log.status
                            )}`}
                          >
                            {getStatusText(item.log.status)}
                          </span>
                        </div>
                        {item.medication && (
                          <div>
                            <p className="text-lg text-gray-700">
                              {item.medication.name}
                            </p>
                            <p className="text-base text-gray-500">
                              {item.medication.dosage}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* サマリー */}
        <Card className="mt-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">統計</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-lg text-gray-600 mb-1">服薬成功</p>
              <p className="text-4xl font-bold text-green-600">
                {dayLogs.reduce(
                  (sum, day) =>
                    sum +
                    day.logs.filter((l) => l.log.status === "taken").length,
                  0
                )}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-lg text-gray-600 mb-1">飲み忘れ</p>
              <p className="text-4xl font-bold text-red-600">
                {dayLogs.reduce(
                  (sum, day) =>
                    sum +
                    day.logs.filter((l) => l.log.status === "missed").length,
                  0
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
