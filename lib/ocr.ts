import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  medicationNames: string[];
}

/**
 * 画像からテキストを抽出
 */
export async function extractTextFromImage(
  imageFile: File | string,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(imageFile, 'jpn+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });

    const text = result.data.text;
    const confidence = result.data.confidence;

    // テキストから薬名候補を抽出
    const medicationNames = extractMedicationNames(text);

    return {
      text,
      confidence,
      medicationNames,
    };
  } catch (error) {
    console.error('OCR処理エラー:', error);
    throw new Error('画像からテキストを抽出できませんでした');
  }
}

/**
 * テキストから薬名候補を抽出
 * 簡易的な実装：カタカナ・漢字を含む単語を抽出
 */
function extractMedicationNames(text: string): string[] {
  // 改行や空白で分割
  const lines = text.split(/[\n\r]+/);
  const candidates: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 空行をスキップ
    if (!trimmed) continue;

    // カタカナまたは漢字を含む行を候補とする
    if (/[ァ-ヶー]|[一-龯]/.test(trimmed)) {
      // 記号や数字を除去
      const cleaned = trimmed
        .replace(/[0-9０-９]/g, '')
        .replace(/[、。，．・]/g, '')
        .trim();

      if (cleaned.length >= 2) {
        candidates.push(cleaned);
      }
    }
  }

  // 重複を削除して返す
  return Array.from(new Set(candidates));
}

/**
 * 画像ファイルのバリデーション
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // ファイルサイズチェック（10MB以下）
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'ファイルサイズが大きすぎます（10MB以下）',
    };
  }

  // ファイルタイプチェック
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '対応していない画像形式です（JPEG, PNG, WebPのみ）',
    };
  }

  return { valid: true };
}

/**
 * 画像ファイルをリサイズ（パフォーマンス向上のため）
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // アスペクト比を維持してリサイズ
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
