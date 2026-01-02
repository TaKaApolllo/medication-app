import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 汎用カードコンポーネント
 */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}
