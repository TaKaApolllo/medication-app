"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import BigButton from "@/components/BigButton";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import {
  migrateToSupabase,
  hasLocalData,
  getLocalDataSummary,
  clearLocalData,
  MigrationResult,
} from "@/lib/migration";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { clearAllData: clearData } = useData();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [showLocalData, setShowLocalData] = useState(false);
  const [localDataSummary, setLocalDataSummary] = useState({ medicationsCount: 0, doseLogsCount: 0 });

  useEffect(() => {
    // 通知サポートチェック
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission("unsupported");
    }

    // LocalStorageから通知設定を読み込む
    const enabled = localStorage.getItem("notificationsEnabled") === "true";
    setNotificationsEnabled(enabled);

    // ローカルデータの確認
    if (user && hasLocalData()) {
      setShowLocalData(true);
      setLocalDataSummary(getLocalDataSummary());
    }
  }, [user]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        localStorage.setItem("notificationsEnabled", "true");
        setNotificationsEnabled(true);

        // テスト通知
        new Notification("通知が有効になりました", {
          body: "服薬時間になったら通知でお知らせします",
          icon: "/icon-192.png",
        });
      }
    }
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", String(newValue));
  };

  const handleMigration = async () => {
    if (!user) {
      alert("ログインしてください");
      return;
    }

    if (!confirm(
      "ローカルのデータをクラウドに移行します。\n" +
      `薬: ${localDataSummary.medicationsCount}件\n` +
      `服薬記録: ${localDataSummary.doseLogsCount}件\n\n` +
      "移行後、ローカルデータは削除されます。\n" +
      "よろしいですか？"
    )) {
      return;
    }

    setMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateToSupabase();
      setMigrationResult(result);

      if (result.success) {
        clearLocalData();
        setShowLocalData(false);
        alert(
          `移行が完了しました！\n\n` +
          `薬: ${result.medicationsMigrated}件\n` +
          `服薬記録: ${result.doseLogsMigrated}件\n\n` +
          (result.errors.length > 0 ? `警告: ${result.errors.length}件のエラーがありました` : "")
        );
      } else {
        alert(
          `移行に失敗しました\n\n` +
          `エラー:\n${result.errors.join("\n")}`
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`移行中にエラーが発生しました: ${message}`);
    } finally {
      setMigrating(false);
    }
  };

  const handleClearAllData = async () => {
    if (
      confirm(
        "すべてのデータを削除してもよろしいですか？\nこの操作は取り消せません。"
      )
    ) {
      try {
        await clearData();
        localStorage.clear();
        alert("すべてのデータを削除しました");
        window.location.href = "/";
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        alert(`削除に失敗しました: ${message}`);
      }
    }
  };

  const handleSignOut = async () => {
    if (confirm("ログアウトしますか？")) {
      try {
        await signOut();
        router.push("/");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        alert(`ログアウトに失敗しました: ${message}`);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="設定" />

        {/* アカウント情報 */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">アカウント</h2>
          {user ? (
            <div>
              <p className="text-lg text-gray-700 mb-4">
                <strong>メールアドレス:</strong> {user.email}
              </p>
              <p className="text-base text-green-600 mb-4">
                ✓ ログイン中（データはクラウドに保存されます）
              </p>
              <BigButton variant="secondary" onClick={handleSignOut}>
                ログアウト
              </BigButton>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-700 mb-4">
                ログインすると、複数の端末でデータを同期できます
              </p>
              <div className="flex gap-4">
                <BigButton
                  variant="primary"
                  onClick={() => router.push("/auth/login")}
                >
                  ログイン
                </BigButton>
                <BigButton
                  variant="secondary"
                  onClick={() => router.push("/auth/signup")}
                >
                  新規登録
                </BigButton>
              </div>
            </div>
          )}
        </Card>

        {/* データ移行 */}
        {showLocalData && (
          <Card className="mb-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              データ移行
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              ローカルに保存されているデータをクラウドに移行できます
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-lg text-gray-700 mb-2">
                <strong>移行対象:</strong>
              </p>
              <ul className="text-lg text-gray-700 list-disc list-inside">
                <li>薬: {localDataSummary.medicationsCount}件</li>
                <li>服薬記録: {localDataSummary.doseLogsCount}件</li>
              </ul>
            </div>
            <BigButton
              variant="primary"
              onClick={handleMigration}
              disabled={migrating}
            >
              {migrating ? "移行中..." : "クラウドに移行する"}
            </BigButton>
          </Card>
        )}

        {/* 通知設定 */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">通知設定</h2>

          {notificationPermission === "unsupported" ? (
            <p className="text-lg text-gray-600">
              お使いのブラウザは通知機能に対応していません
            </p>
          ) : notificationPermission === "denied" ? (
            <div>
              <p className="text-lg text-red-600 mb-2">
                通知が拒否されています
              </p>
              <p className="text-base text-gray-600">
                ブラウザの設定から通知を許可してください
              </p>
            </div>
          ) : notificationPermission === "granted" ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl text-gray-700">通知を有効にする</span>
                <button
                  onClick={toggleNotifications}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    notificationsEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      notificationsEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-base text-gray-600">
                {notificationsEnabled
                  ? "通知が有効です。服薬時間になったらお知らせします。"
                  : "通知が無効です。有効にすると服薬時間にお知らせします。"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-700 mb-4">
                通知を受け取るには許可が必要です
              </p>
              <BigButton
                variant="primary"
                onClick={requestNotificationPermission}
              >
                通知を許可する
              </BigButton>
            </div>
          )}
        </Card>

        {/* データ管理 */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">データ管理</h2>
          <p className="text-lg text-gray-600 mb-4">
            {user
              ? "すべてのデータ（クラウド + ローカル）を完全に削除します"
              : "すべてのデータ（この端末のみ）を削除します"}
          </p>
          <BigButton variant="danger" onClick={handleClearAllData}>
            すべてのデータを削除
          </BigButton>
        </Card>

        {/* アプリ情報 */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            アプリ情報
          </h2>
          <div className="space-y-2 text-lg text-gray-700">
            <p>
              <strong>バージョン:</strong> 0.1.0 (MVP)
            </p>
            <p>
              <strong>説明:</strong> 高齢者向け服薬管理システム
            </p>
            <p className="text-base text-gray-600 mt-4">
              このアプリは、お薬の飲み忘れを防ぐためのツールです。
              薬の情報はすべてこの端末のブラウザに保存されます。
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
