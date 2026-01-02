"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BigButton from "@/components/BigButton";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "登録に失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-md mx-auto">
          <PageHeader title="登録完了" />
          <Card className="bg-green-50 border-2 border-green-500">
            <p className="text-2xl text-center text-green-700 font-bold mb-4">
              ✓ 登録が完了しました！
            </p>
            <p className="text-lg text-center text-gray-700 mb-6">
              確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。
            </p>
            <Link href="/auth/login">
              <BigButton variant="primary" className="w-full">
                ログインページへ
              </BigButton>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <PageHeader title="新規登録" />

        <Card>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                <p className="text-lg text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="6文字以上"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-700 mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="もう一度入力"
              />
            </div>

            <BigButton
              type="submit"
              variant="primary"
              className="w-full mb-4"
              disabled={loading}
            >
              {loading ? "登録中..." : "登録する"}
            </BigButton>

            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">
                すでにアカウントをお持ちですか？
              </p>
              <Link
                href="/auth/login"
                className="text-lg text-blue-600 hover:underline"
              >
                ログインはこちら
              </Link>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-lg text-gray-600 hover:underline">
            ← 登録せずに使う
          </Link>
        </div>
      </div>
    </main>
  );
}
