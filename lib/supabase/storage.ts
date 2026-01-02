import { supabase } from './client';

const BUCKET_NAME = 'medication-photos';

/**
 * 薬の写真をアップロード
 */
export async function uploadMedicationPhoto(
  file: File,
  medicationId: string
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('ログインが必要です');
  }

  // ファイル名を生成（ユーザーID/薬ID/タイムスタンプ.拡張子）
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${medicationId}/${Date.now()}.${fileExt}`;

  // アップロード
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('写真のアップロードに失敗しました');
  }

  // 公開URLを取得
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * 薬の写真を削除
 */
export async function deleteMedicationPhoto(photoUrl: string): Promise<void> {
  try {
    // URLからパスを抽出
    const url = new URL(photoUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);

    if (!pathMatch) {
      throw new Error('Invalid photo URL');
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete photo:', error);
    // 写真の削除失敗は致命的ではないので、エラーをログに記録するのみ
  }
}

/**
 * 薬の写真を更新（古い写真を削除して新しい写真をアップロード）
 */
export async function updateMedicationPhoto(
  oldPhotoUrl: string | undefined,
  newFile: File,
  medicationId: string
): Promise<string> {
  // 古い写真を削除
  if (oldPhotoUrl) {
    await deleteMedicationPhoto(oldPhotoUrl);
  }

  // 新しい写真をアップロード
  return await uploadMedicationPhoto(newFile, medicationId);
}

/**
 * Supabase Storageバケットの存在確認
 */
export async function checkStorageBucket(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
    return !error && !!data;
  } catch {
    return false;
  }
}
