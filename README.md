# 服薬管理アプリ

高齢者向けの服薬管理システム（MVP版）

## 概要

このアプリは、高齢者が薬の飲み忘れや「飲んだか分からない」という不安を軽減するために開発されました。

### 主な機能

- **薬の登録**: 薬名、用量、服薬時刻、メモを登録
- **服薬スケジュール**: 次に飲む薬を大きく表示
- **簡単記録**: ワンタップで「飲んだ」を記録
- **履歴確認**: 過去7日間の服薬記録を確認
- **通知機能**: ブラウザ通知で服薬時間をお知らせ（対応ブラウザのみ）

### 高齢者向けUX

- 大きなボタンと文字（最小48px、文字18px〜）
- 高コントラスト配色
- シンプルなナビゲーション
- 誤操作防止の確認ダイアログ

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ保存**: LocalStorage（Phase 1）
- **通知**: Web Notification API
- **PWA**: manifest.json対応

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

### ビルド

```bash
# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

## 使い方

### 1. 薬を登録する

1. 「お薬」タブをタップ
2. 「＋ 新しいお薬を追加」ボタンをタップ
3. 薬名、用量、服薬時刻を入力
4. 「登録する」をタップ

### 2. 服薬を記録する

1. ホーム画面で次に飲む薬を確認
2. 薬を飲んだら「飲んだ」ボタンをタップ
3. 記録完了！

### 3. 履歴を確認する

1. 「履歴」タブをタップ
2. 過去7日間の記録を確認
3. 飲み忘れがあれば赤色で表示

### 4. 通知を有効にする

1. 「設定」タブをタップ
2. 「通知を許可する」ボタンをタップ
3. ブラウザの許可ダイアログで「許可」を選択

## プロジェクト構成

```
medication-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホーム画面
│   ├── meds/              # 薬の管理
│   │   ├── page.tsx       # 薬一覧
│   │   ├── new/           # 薬追加
│   │   └── edit/[id]/     # 薬編集
│   ├── history/           # 履歴画面
│   ├── settings/          # 設定画面
│   └── layout.tsx         # ルートレイアウト
├── components/            # 共通コンポーネント
│   ├── BigButton.tsx      # 大きいボタン
│   ├── Card.tsx           # カード
│   ├── Navigation.tsx     # ナビゲーション
│   └── PageHeader.tsx     # ページヘッダー
├── lib/                   # ユーティリティ
│   ├── storage.ts         # LocalStorage操作
│   ├── dateUtils.ts       # 日付処理
│   └── scheduleUtils.ts   # スケジュール管理
├── types/                 # TypeScript型定義
│   └── index.ts
└── public/                # 静的ファイル
    └── manifest.json      # PWA設定
```

## データモデル

### Medication（薬）

```typescript
interface Medication {
  id: string;
  name: string;              // 薬名
  dosage: string;            // 用量
  times: string[];           // 服薬時刻（例: ["08:00", "12:00"]）
  instructions?: string;     // メモ
  photoUrl?: string;         // 写真URL（Phase 2）
  createdAt: string;         // 作成日時
}
```

### DoseLog（服薬記録）

```typescript
interface DoseLog {
  id: string;
  medId: string;             // 薬のID
  scheduledDate: string;     // 予定日（YYYY-MM-DD）
  scheduledTime: string;     // 予定時刻（HH:MM）
  takenAt?: string;          // 実際に飲んだ日時
  status: "taken" | "missed" | "skipped";
}
```

## 今後の拡張予定（Phase 2以降）

### Phase 2: クラウド同期

- [ ] Supabase連携
- [ ] ユーザー認証（Email/Password）
- [ ] 複数端末でのデータ同期
- [ ] 写真アップロード機能

### Phase 3: 画像認識（OCR）

- [ ] 薬の写真から薬名を抽出
- [ ] Tesseract.js または外部OCR API
- [ ] 薬名候補の自動入力補助

### その他の改善案

- [ ] Service Worker（完全なPWA対応）
- [ ] プッシュ通知（定期的な通知）
- [ ] カレンダー連携
- [ ] 家族への共有機能
- [ ] エクスポート機能（CSV等）
- [ ] ダークモード
- [ ] 多言語対応（i18n）

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Lint実行
npm run lint

# 型チェック
npm run type-check
```

## ライセンス

ISC

## 作成者

Claude Code

---

**注意**: このアプリは服薬管理の補助ツールです。医療行為の代替ではありません。重要な医療判断は必ず医師に相談してください。
