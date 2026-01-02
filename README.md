# 服薬管理アプリ

高齢者向けの服薬管理システム - お薬の飲み忘れを防ぎ、不安を軽減します

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)

## 🌟 主な機能

### Phase 1: MVP機能 ✅
- **薬の登録・管理**: 薬名、用量、服薬時刻、メモを登録
- **服薬スケジュール**: 次に飲むべき薬を大きく表示
- **ワンタップ記録**: 「飲んだ」ボタンで簡単に記録
- **服薬履歴**: 過去7日間の服薬状況を確認
- **通知機能**: Web通知APIで服薬時間をお知らせ
- **高齢者向けUI**: 大きなボタン（60px以上）、大きな文字（18px以上）

### Phase 2: クラウド同期 ✅
- **ユーザー認証**: メール/パスワードでログイン・新規登録
- **クラウドデータベース**: Supabaseで複数端末からアクセス
- **データ移行**: LocalStorageからクラウドへワンクリック移行
- **オフライン対応**: ログインなしでもLocalStorageで利用可能
- **セキュア**: Row Level Securityでユーザーデータを保護

### Phase 3: OCR画像認識 ✅
- **写真撮影**: カメラで薬のパッケージを撮影
- **自動読み取り**: Tesseract.jsで薬名を自動抽出
- **候補選択**: 検出された薬名候補から選択
- **写真保存**: Supabase Storageに写真を保存
- **日英対応**: 日本語・英語のOCR処理

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage
- **OCR**: Tesseract.js
- **デプロイ**: Vercel推奨

## 📋 必要要件

- Node.js 18.x以上
- npm または yarn
- Supabaseアカウント（クラウド機能を使用する場合）

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/TaKaApolllo/medication-app.git
cd medication-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabaseのセットアップ

#### 4-1. プロジェクト作成
1. https://supabase.com でアカウント作成
2. 新しいプロジェクトを作成
3. Project URLとAnon Keyを `.env.local` に設定

#### 4-2. データベーススキーマの作成
1. Supabaseダッシュボードの SQL Editor を開く
2. `supabase/schema.sql` の内容を実行（3ステップに分けて実行）
   - Step 1: CREATE TABLE文
   - Step 2: ALTER TABLE と CREATE POLICY文
   - Step 3: CREATE INDEX と CREATE TRIGGER文

詳細: `supabase/schema.sql` を参照

#### 4-3. Storageバケットの設定
1. Supabaseダッシュボードの Storage を開く
2. `medication-photos` バケットを作成（Public）
3. アクセスポリシーを設定

詳細: `supabase/STORAGE_SETUP.md` を参照

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## 📱 使い方

### 初回利用

1. **ログインなしで使用**: そのまま薬を登録して使用開始（LocalStorage）
2. **ログインして使用**: 新規登録してクラウド同期を有効化

### 薬の登録

#### 手動登録
1. 「お薬の管理」→「+ 新しいお薬を追加」
2. 薬名、用量、服薬時刻を入力
3. 「登録する」をクリック

#### OCRで登録（推奨）
1. 「お薬の管理」→「+ 新しいお薬を追加」
2. 「📷 写真から薬名を読み取る」をクリック
3. 薬のパッケージや説明書を撮影
4. 「薬名を読み取る」をクリック
5. 検出された薬名を選択
6. 用量、服薬時刻を入力して登録

### 服薬の記録

1. ホーム画面に次に飲むべき薬が表示
2. 薬を飲んだら「飲んだ」ボタンをタップ
3. 記録が自動的に保存される

### データ移行（LocalStorage → クラウド）

1. アカウント登録・ログイン
2. 「設定」画面を開く
3. 「データ移行」セクションで「クラウドに移行する」をクリック
4. 確認画面でOKをクリック

## 📁 プロジェクト構造

```
medication-app/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証ページ
│   │   ├── login/         # ログイン
│   │   └── signup/        # 新規登録
│   ├── meds/              # 薬管理
│   │   ├── new/           # 新規登録
│   │   └── edit/[id]/     # 編集
│   ├── history/           # 服薬履歴
│   ├── settings/          # 設定
│   └── page.tsx           # ホーム
├── components/            # Reactコンポーネント
│   ├── BigButton.tsx      # 大きなボタン
│   ├── Card.tsx           # カードコンテナ
│   ├── Navigation.tsx     # 下部ナビゲーション
│   ├── PageHeader.tsx     # ページヘッダー
│   ├── PhotoOCR.tsx       # OCRコンポーネント
│   └── Providers.tsx      # Context Provider
├── contexts/              # React Context
│   └── AuthContext.tsx    # 認証状態管理
├── hooks/                 # カスタムフック
│   └── useData.ts         # 統合データアクセス
├── lib/                   # ユーティリティ
│   ├── dateUtils.ts       # 日付操作
│   ├── migration.ts       # データ移行
│   ├── ocr.ts             # OCR処理
│   ├── scheduleUtils.ts   # スケジュール計算
│   ├── storage.ts         # LocalStorage操作
│   └── supabase/          # Supabase関連
│       ├── api.ts         # データベースAPI
│       ├── client.ts      # Supabaseクライアント
│       └── storage.ts     # ストレージAPI
├── supabase/              # Supabase設定
│   ├── schema.sql         # データベーススキーマ
│   └── STORAGE_SETUP.md   # Storage設定手順
├── types/                 # TypeScript型定義
│   └── index.ts
└── public/                # 静的ファイル
    ├── manifest.json      # PWA設定
    └── icons/             # アプリアイコン
```

## 🔐 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトURL | クラウド機能使用時 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | クラウド機能使用時 |

## 🧪 ビルドとデプロイ

### ローカルビルド

```bash
npm run build
npm start
```

### Vercelへのデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

## 🎨 デザイン思想

### 高齢者向けUI/UX

- **大きなタッチターゲット**: 最小48px（推奨60px以上）
- **大きな文字**: ベース18px、見出し24px以上
- **高コントラスト**: 読みやすい配色
- **シンプルな画面遷移**: 最小限のステップ
- **明確なフィードバック**: 成功・エラーメッセージを大きく表示

### プログレッシブエンハンスメント

- **オフラインファースト**: LocalStorageで動作
- **オプショナル認証**: ログインなしでも使用可能
- **段階的機能**: 基本→クラウド→OCRと段階的に機能追加

## 📊 データモデル

### Medication (薬)
```typescript
{
  id: string;
  name: string;           // 薬名
  dosage: string;         // 用量
  times: string[];        // 服薬時刻 ["08:00", "12:00", "20:00"]
  instructions?: string;  // メモ
  photoUrl?: string;      // 写真URL
  createdAt: string;      // 作成日時
}
```

### DoseLog (服薬記録)
```typescript
{
  id: string;
  medId: string;          // 薬ID
  scheduledDate: string;  // 予定日 (YYYY-MM-DD)
  scheduledTime: string;  // 予定時刻 (HH:MM)
  takenAt?: string;       // 服薬日時
  status: "taken" | "missed" | "skipped";
}
```

## 🤝 コントリビューション

プルリクエスト歓迎！以下の点にご注意ください：

1. 高齢者向けUIの原則を守る
2. TypeScriptの型安全性を保つ
3. アクセシビリティを考慮する
4. テストを追加（将来的に）

## 📄 ライセンス

MIT License

## 👥 開発者

TaKaApolllo

## 🙏 謝辞

このプロジェクトは、高齢者の服薬管理を支援し、健康的な生活をサポートすることを目的としています。

---

**注意**: このアプリは服薬管理の補助ツールです。医療行為の代替ではありません。重要な医療判断は必ず医師に相談してください。

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
