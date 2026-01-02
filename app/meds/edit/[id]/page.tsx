"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BigButton from "@/components/BigButton";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import { Medication } from "@/types";
import { getMedicationById, updateMedication } from "@/lib/storage";

export default function EditMedPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [medication, setMedication] = useState<Medication | null>(null);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const med = getMedicationById(id);
    if (med) {
      setMedication(med);
      setName(med.name);
      setDosage(med.dosage);
      setTimes(med.times);
      setInstructions(med.instructions || "");
    } else {
      alert("お薬が見つかりませんでした");
      router.push("/meds");
    }
  }, [id, router]);

  const handleAddTime = () => {
    setTimes([...times, ""]);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleRemoveTime = (index: number) => {
    if (times.length > 1) {
      const newTimes = times.filter((_, i) => i !== index);
      setTimes(newTimes);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!name.trim()) {
      alert("お薬の名前を入力してください");
      return;
    }

    if (!dosage.trim()) {
      alert("用量を入力してください");
      return;
    }

    const validTimes = times.filter((t) => t.trim() !== "");
    if (validTimes.length === 0) {
      alert("服薬時刻を1つ以上入力してください");
      return;
    }

    // 更新
    updateMedication(id, {
      name: name.trim(),
      dosage: dosage.trim(),
      times: validTimes,
      instructions: instructions.trim() || undefined,
    });

    // 一覧ページに戻る
    router.push("/meds");
  };

  if (!medication) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-center text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="お薬を編集"
          backButton={
            <Link href="/meds">
              <button className="text-blue-600 text-xl hover:underline">
                ← 戻る
              </button>
            </Link>
          }
        />

        <Card>
          <form onSubmit={handleSubmit}>
            {/* 薬の名前 */}
            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                お薬の名前 <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="例: ロキソニン"
              />
            </div>

            {/* 用量 */}
            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                用量 <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="例: 1錠"
              />
            </div>

            {/* 服薬時刻 */}
            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                服薬時刻 <span className="text-red-600">*</span>
              </label>
              {times.map((time, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  {times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(index)}
                      className="px-4 py-3 bg-red-100 text-red-800 rounded-lg text-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTime}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                ＋ 時刻を追加
              </button>
            </div>

            {/* メモ */}
            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                メモ・注意事項
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                rows={3}
                placeholder="例: 食後に飲む"
              />
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-3">
              <Link href="/meds" className="flex-1">
                <BigButton variant="secondary" className="w-full">
                  キャンセル
                </BigButton>
              </Link>
              <div className="flex-1">
                <BigButton type="submit" variant="primary" className="w-full">
                  更新する
                </BigButton>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
