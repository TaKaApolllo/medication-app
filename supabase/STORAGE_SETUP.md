# Supabase Storage セットアップ手順

薬の写真を保存するためのSupabase Storageバケットを設定します。

## 1. Supabaseダッシュボードにアクセス

1. https://supabase.com にアクセスしてログイン
2. プロジェクトを選択

## 2. Storageバケットの作成

1. 左サイドバーから **Storage** をクリック
2. **New bucket** ボタンをクリック
3. 以下の設定でバケットを作成:
   - **Name**: `medication-photos`
   - **Public bucket**: ✅ チェックを入れる（公開バケット）
   - **File size limit**: 10 MB（デフォルトのまま）
4. **Create bucket** をクリック

## 3. バケットポリシーの設定

バケット作成後、適切なアクセス制御を設定します。

### 3-1. ポリシーページへ移動

1. 作成した `medication-photos` バケットをクリック
2. 上部の **Policies** タブをクリック
3. **New policy** をクリック

### 3-2. アップロードポリシー（INSERT）

**Get started quickly** セクションで **INSERT** を選択し、以下を設定:

- **Policy name**: `Authenticated users can upload photos`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
  ```sql
  (bucket_id = 'medication-photos'::text) AND
  (auth.uid() = (storage.foldername(name))[1]::uuid)
  ```

これにより、認証済みユーザーは自分のフォルダ（user_id/）内にのみアップロード可能になります。

**Create policy** をクリック

### 3-3. 読み取りポリシー（SELECT）

再度 **New policy** をクリックし、**SELECT** を選択:

- **Policy name**: `Anyone can view photos`
- **Target roles**: `public`（または `authenticated` のみに制限も可）
- **USING expression**:
  ```sql
  bucket_id = 'medication-photos'::text
  ```

これにより、すべてのユーザーが写真を閲覧可能になります（プライベートにする場合は `authenticated` のみに制限）。

**Create policy** をクリック

### 3-4. 削除ポリシー（DELETE）

再度 **New policy** をクリックし、**DELETE** を選択:

- **Policy name**: `Users can delete own photos`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  (bucket_id = 'medication-photos'::text) AND
  (auth.uid() = (storage.foldername(name))[1]::uuid)
  ```

これにより、ユーザーは自分がアップロードした写真のみ削除可能になります。

**Create policy** をクリック

## 4. 設定の確認

1. Policies タブで以下の3つのポリシーが作成されていることを確認:
   - ✅ Authenticated users can upload photos (INSERT)
   - ✅ Anyone can view photos (SELECT)
   - ✅ Users can delete own photos (DELETE)

2. Bucket設定が以下のようになっていることを確認:
   - Public: ✅ Yes
   - File size limit: 10 MB

## 完了！

これでアプリケーションから写真のアップロード・表示・削除が可能になりました。

## トラブルシューティング

### アップロードエラーが発生する場合

- バケット名が `medication-photos` と完全に一致しているか確認
- Public bucketが有効になっているか確認
- INSERTポリシーが正しく設定されているか確認

### 写真が表示されない場合

- SELECTポリシーが設定されているか確認
- ブラウザの開発者ツールでネットワークエラーを確認

### 削除できない場合

- DELETEポリシーが設定されているか確認
- 自分がアップロードした写真かどうか確認（他のユーザーの写真は削除不可）
