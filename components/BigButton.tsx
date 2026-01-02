import React from "react";

interface BigButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

/**
 * 高齢者向けの大きく押しやすいボタン
 */
export default function BigButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: BigButtonProps) {
  const baseStyles = `
    min-h-[60px] px-8 py-4
    text-xl font-bold rounded-lg
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    shadow-md hover:shadow-lg
  `;

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
