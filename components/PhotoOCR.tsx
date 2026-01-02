"use client";

import { useState, useRef } from 'react';
import BigButton from './BigButton';
import Card from './Card';
import { extractTextFromImage, validateImageFile, resizeImage } from '@/lib/ocr';

interface PhotoOCRProps {
  onMedicationSelected: (name: string, photoFile: File) => void;
  onCancel: () => void;
}

export default function PhotoOCR({ onMedicationSelected, onCancel }: PhotoOCRProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // バリデーション
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }

    setError('');
    setSelectedFile(file);

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessOCR = async () => {
    if (!selectedFile) return;

    try {
      setProcessing(true);
      setProgress(0);
      setError('');

      // 画像をリサイズ
      const resized = await resizeImage(selectedFile);
      const resizedFile = new File([resized], selectedFile.name, {
        type: selectedFile.type,
      });

      // OCR処理
      const result = await extractTextFromImage(resizedFile, setProgress);

      if (result.medicationNames.length === 0) {
        setError('薬名を検出できませんでした。手動で入力してください。');
        setCandidates([]);
      } else {
        setCandidates(result.medicationNames);
      }
    } catch (err) {
      console.error('OCR処理エラー:', err);
      setError('画像の処理に失敗しました。もう一度お試しください。');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleSelectCandidate = (name: string) => {
    if (selectedFile) {
      onMedicationSelected(name, selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      {/* ファイル選択 */}
      {!selectedFile && (
        <Card>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            薬の写真を撮影
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            薬のパッケージや説明書を撮影すると、薬名を自動で読み取ります
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-3">
            <BigButton
              variant="primary"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              📷 写真を撮影
            </BigButton>

            <BigButton
              variant="secondary"
              className="w-full"
              onClick={onCancel}
            >
              キャンセル
            </BigButton>
          </div>
        </Card>
      )}

      {/* プレビューとOCR処理 */}
      {selectedFile && !candidates.length && (
        <Card>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            撮影した写真
          </h3>

          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="プレビュー"
                className="w-full rounded-lg border-2 border-gray-300"
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="text-lg text-red-700">{error}</p>
            </div>
          )}

          {processing && (
            <div className="mb-4">
              <p className="text-lg text-gray-700 mb-2">
                画像を処理中... {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <BigButton
              variant="primary"
              className="w-full"
              onClick={handleProcessOCR}
              disabled={processing}
            >
              {processing ? '処理中...' : '薬名を読み取る'}
            </BigButton>

            <BigButton
              variant="secondary"
              className="w-full"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                setCandidates([]);
                setError('');
              }}
              disabled={processing}
            >
              撮り直す
            </BigButton>
          </div>
        </Card>
      )}

      {/* 候補選択 */}
      {candidates.length > 0 && (
        <Card>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            検出された薬名候補
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            正しい薬名を選択してください
          </p>

          <div className="space-y-3 mb-4">
            {candidates.map((name, index) => (
              <button
                key={index}
                onClick={() => handleSelectCandidate(name)}
                className="w-full p-4 text-left text-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-lg transition-colors"
              >
                {name}
              </button>
            ))}
          </div>

          <BigButton
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSelectedFile(null);
              setPreview(null);
              setCandidates([]);
              setError('');
            }}
          >
            撮り直す
          </BigButton>
        </Card>
      )}
    </div>
  );
}
