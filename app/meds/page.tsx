"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BigButton from "@/components/BigButton";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import { Medication } from "@/types";
import { useData } from "@/hooks/useData";

export default function MedsPage() {
  const router = useRouter();
  const { getMedications, deleteMedication } = useData();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const meds = await getMedications();
      setMedications(meds);
    } catch (error) {
      console.error("データの読み込みに失敗:", error);
      alert("データの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`「${name}」を削除してもよろしいですか？`)) {
      try {
        await deleteMedication(id);
        await loadMedications();
      } catch (error) {
        console.error("削除に失敗:", error);
        alert("削除に失敗しました");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="お薬の管理" />

        {/* 新規登録ボタン */}
        <Link href="/meds/new">
          <BigButton variant="primary" className="w-full mb-6">
            ＋ 新しいお薬を追加
          </BigButton>
        </Link>

        {/* 薬一覧 */}
        {loading ? (
          <Card>
            <p className="text-xl text-center text-gray-600">
              読み込み中...
            </p>
          </Card>
        ) : medications.length === 0 ? (
          <Card>
            <p className="text-xl text-center text-gray-600">
              まだお薬が登録されていません
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => (
              <Card key={med.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {med.name}
                    </h3>
                    <p className="text-xl text-gray-600 mb-2">{med.dosage}</p>
                  </div>
                </div>

                {/* 服薬時刻 */}
                <div className="mb-3">
                  <p className="text-lg text-gray-600 mb-2">服薬時刻:</p>
                  <div className="flex flex-wrap gap-2">
                    {med.times.map((time, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-lg font-medium"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                {/* メモ */}
                {med.instructions && (
                  <div className="mb-3">
                    <p className="text-lg text-gray-600 mb-1">メモ:</p>
                    <p className="text-lg text-gray-700">{med.instructions}</p>
                  </div>
                )}

                {/* アクション */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/meds/edit/${med.id}`)}
                    className="flex-1 px-4 py-3 bg-blue-100 text-blue-800 rounded-lg text-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(med.id, med.name)}
                    className="flex-1 px-4 py-3 bg-red-100 text-red-800 rounded-lg text-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
