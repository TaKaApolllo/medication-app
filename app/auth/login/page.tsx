"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BigButton from "@/components/BigButton";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/");
    } catch (err) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <PageHeader title="ログイン" />

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
                placeholder="パスワード（6文字以上）"
              />
            </div>

            <BigButton
              type="submit"
              variant="primary"
              className="w-full mb-4"
              disabled={loading}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </BigButton>

            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">
                アカウントをお持ちでないですか？
              </p>
              <Link
                href="/auth/signup"
                className="text-lg text-blue-600 hover:underline"
              >
                新規登録はこちら
              </Link>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-lg text-gray-600 hover:underline">
            ← ログインせずに使う
          </Link>
        </div>
      </div>
    </main>
  );
}
