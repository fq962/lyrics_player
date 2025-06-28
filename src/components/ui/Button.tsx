"use client";

import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-2xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98] hover:scale-[1.02]
    backdrop-blur-xl border border-white/10
    relative overflow-hidden
    before:absolute before:inset-0 before:rounded-2xl before:p-[1px]
    before:bg-gradient-to-b before:from-white/20 before:to-white/5
    before:mask-composite before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)]
    before:[mask-composite:subtract]
  `.trim();

  const variantClasses = {
    primary: `
      bg-gradient-to-b from-blue-500/90 to-blue-600/80
      hover:from-blue-400/90 hover:to-blue-500/80
      active:from-blue-600/90 active:to-blue-700/80
      text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
      border-blue-400/30 hover:border-blue-300/40
    `.trim(),
    secondary: `
      bg-gradient-to-b from-white/20 to-white/10
      hover:from-white/30 hover:to-white/20
      active:from-white/10 active:to-white/5
      dark:from-white/10 dark:to-white/5
      dark:hover:from-white/20 dark:hover:to-white/10
      text-gray-800 dark:text-white/90
      shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15
      border-white/20 hover:border-white/30
    `.trim(),
    outline: `
      bg-gradient-to-b from-transparent to-white/5
      hover:from-white/10 hover:to-white/15
      active:from-white/5 active:to-white/10
      dark:hover:from-white/5 dark:hover:to-white/10
      text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white
      shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10
      border-gray-300/50 dark:border-white/20 hover:border-gray-400/60 dark:hover:border-white/30
    `.trim(),
    ghost: `
      bg-gradient-to-b from-transparent to-transparent
      hover:from-white/10 hover:to-white/5
      active:from-white/15 active:to-white/10
      dark:hover:from-white/5 dark:hover:to-white/5
      text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white
      border-transparent hover:border-white/20
      shadow-none hover:shadow-lg hover:shadow-black/5
    `.trim(),
  };

  const sizeClasses = {
    small: "px-4 py-2 text-sm h-9 min-w-[80px]",
    medium: "px-6 py-3 text-base h-11 min-w-[100px]",
    large: "px-8 py-4 text-lg h-14 min-w-[120px]",
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

      {/* Button content */}
      <span className="relative z-10 font-medium tracking-wide">{label}</span>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};

export default Button;
