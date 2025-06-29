"use client";

import React from "react";

interface SongCardProps {
  title: string;
  linesCount: number;
  onEdit?: () => void;
  onPlay?: () => void;
  gradient?: string;
  className?: string;
}

export const SongCard: React.FC<SongCardProps> = ({
  title,
  linesCount,
  onEdit,
  onPlay,
  gradient = "from-purple-500 to-pink-500",
  className = "",
}) => {
  return (
    <div
      className={`relative group cursor-pointer rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${className}`}
      onClick={onPlay}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`}
      />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative p-4 h-48 flex flex-col justify-between">
        {/* Music Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white/90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467L9 6.75V9"
              />
            </svg>
          </div>
        </div>

        {/* Song Info */}
        <div className="flex-1 flex flex-col justify-end">
          <h3 className="text-white text-base font-semibold mb-1 text-center truncate">
            {title}
          </h3>
          <p className="text-white/70 text-xs text-center">
            {linesCount} líneas
          </p>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Botón editar clickeado"); // Para debugging
              onEdit();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/30 hover:bg-white/40 backdrop-blur-md rounded-full border border-white/40 text-white/90 hover:text-white transition-all duration-200 opacity-80 group-hover:opacity-100 z-10"
          >
            <svg
              className="w-3.5 h-3.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default SongCard;
