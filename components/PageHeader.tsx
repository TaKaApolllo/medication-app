import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backButton?: React.ReactNode;
}

/**
 * ページヘッダー（タイトル表示）
 */
export default function PageHeader({
  title,
  subtitle,
  backButton,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      {backButton && <div className="mb-4">{backButton}</div>}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-600">{subtitle}</p>
      )}
    </header>
  );
}
