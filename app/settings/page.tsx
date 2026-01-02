"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import BigButton from "@/components/BigButton";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");

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
  }, []);

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

  const clearAllData = () => {
    if (
      confirm(
        "すべてのデータを削除してもよろしいですか？\nこの操作は取り消せません。"
      )
    ) {
      localStorage.clear();
      alert("すべてのデータを削除しました");
      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="設定" />

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
            すべてのデータはこの端末に保存されています
          </p>
          <BigButton variant="danger" onClick={clearAllData}>
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
