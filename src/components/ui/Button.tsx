"use client";

import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success";
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
    inline-flex items-center justify-center font-medium rounded-full
    transition-all duration-200 ease-out
    focus:outline-none 
    disabled:opacity-40 disabled:cursor-not-allowed
    hover:scale-[1.02] active:scale-[0.98]
    backdrop-blur-md
    relative overflow-hidden
  `.trim();

  const variantClasses = {
    primary: `
      bg-[#8C8C8C]/15 hover:bg-[#8C8C8C]/30 active:bg-[#8C8C8C]/35
      text-black/80 hover:text-black/90
      border border-white/20 hover:border-white/30
    `.trim(),
    success: `
      bg-[#8C8C8C]/15 hover:bg-[#8C8C8C]/30 active:bg-[#8C8C8C]/35
      text-black/80 hover:text-black/90
      border border-white/20 hover:border-white/30
    `.trim(),
    secondary: `
      bg-[#8C8C8C]/15 hover:bg-[#8C8C8C]/30 active:bg-[#8C8C8C]/35
      text-black/80 hover:text-black/90
      border border-white/20 hover:border-white/30
    `.trim(),
    outline: `
      bg-[#8C8C8C]/15 hover:bg-[#8C8C8C]/25 active:bg-[#8C8C8C]/30
      text-black/70 hover:text-black/80
      border border-white/30 hover:border-white/40
    `.trim(),
    ghost: `
      bg-[#8C8C8C]/15 hover:bg-[#8C8C8C]/20 active:bg-[#8C8C8C]/25
      text-black/70 hover:text-black/80
      border border-transparent hover:border-white/20
    `.trim(),
  };

  const sizeClasses = {
    small: "px-6 py-2 text-sm h-9",
    medium: "px-8 py-3 text-base h-11",
    large: "px-10 py-4 text-lg h-13",
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
      style={{
        boxShadow:
          "inset 3px 3px 0px -3px rgba(255, 255, 255, 0.8), inset -3px -3px 0px -3px rgba(255, 255, 255, 0.4)",
      }}
    >
      <span className="relative z-10 font-medium">{label}</span>
    </button>
  );
};

export default Button;
