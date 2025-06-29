"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";

interface ReproducerSong {
  id: string;
  title: string;
  lyrics: string;
  artist?: string;
  linesCount: number;
}

const ReproducerPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [song, setSong] = useState<ReproducerSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<
    "lenta" | "normal" | "rapida" | "muy-rapida"
  >("normal");

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Velocidades de scroll en píxeles por frame (60fps)
  const speedMultipliers = {
    lenta: 1,
    normal: 2,
    rapida: 4,
    "muy-rapida": 6,
  };

  useEffect(() => {
    if (searchParams) {
      const songId = searchParams.get("id");
      const title = searchParams.get("title") || "Título de la canción";
      const lyrics = searchParams.get("lyrics") || "Letra de la canción...";

      if (songId) {
        setSong({
          id: songId,
          title: decodeURIComponent(title),
          lyrics: decodeURIComponent(lyrics),
          linesCount: lyrics.split("\n").length,
        });
      }
    }
  }, [searchParams]);

  // Efecto para controlar el scroll automático
  useEffect(() => {
    if (isPlaying && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const speedMultiplier = speedMultipliers[speed];

      const scrollFunction = () => {
        if (container && isPlaying) {
          const currentScrollTop = container.scrollTop;
          const maxScrollTop = container.scrollHeight - container.clientHeight;

          // Si llegamos al final, reiniciamos desde el principio
          if (currentScrollTop >= maxScrollTop - 10) {
            container.scrollTop = 0;
          } else {
            // Scroll hacia abajo
            container.scrollTop += speedMultiplier;
          }
        }
      };

      scrollIntervalRef.current = setInterval(scrollFunction, 50); // ~20fps para movimiento más suave
    } else {
      // Limpiar el intervalo cuando se pausa
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    // Cleanup al desmontar o cambiar dependencias
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [isPlaying, speed, speedMultipliers]);

  const handleBack = () => {
    router.back();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const speeds = [
    { id: "lenta", label: "Lenta" },
    { id: "normal", label: "Normal" },
    { id: "rapida", label: "Rápida" },
    { id: "muy-rapida", label: "Muy Rápida" },
  ] as const;

  if (!song) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header with Back Button and Title */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-white/80 hover:text-white transition-colors p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">
            {song.title.toUpperCase()}
          </h1>
        </div>

        {/* Right side - Speed controls */}
        <div className="flex items-center gap-2">
          {speeds.map((speedOption) => (
            <Button
              key={speedOption.id}
              label={speedOption.label}
              onClick={() => setSpeed(speedOption.id)}
              variant={speed === speedOption.id ? "success" : "ghost"}
              size="small"
              className={
                speed === speedOption.id
                  ? "!bg-green-500/20 !text-green-400 !border-green-400/30"
                  : "!text-white/60 hover:!text-white/80 !bg-transparent !border-transparent"
              }
            />
          ))}

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="ml-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            {isPlaying ? (
              // Pause Icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6"
                />
              </svg>
            ) : (
              // Play Icon
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Lyrics Area */}
      <main
        ref={lyricsContainerRef}
        className="fixed inset-0 top-20 bottom-0 overflow-y-scroll scrollbar-hide"
        style={{
          scrollBehavior: "auto", // Evitar scroll suave nativo para mejor control
        }}
      >
        <div className="min-h-full flex items-start justify-center px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide">
              {/* Espacio inicial para que el texto comience desde el centro */}
              <div className="h-screen"></div>

              {song.lyrics.split("\n").map((line, index) => (
                <div
                  key={index}
                  className="mb-4 text-white opacity-90"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {line || "\u00A0"} {/* Non-breaking space for empty lines */}
                </div>
              ))}

              {/* Espacio adicional al final para scroll continuo */}
              <div className="h-screen"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Status indicator */}
      {isPlaying && (
        <div className="fixed bottom-4 left-4">
          <div className="bg-green-500/20 backdrop-blur-md rounded-full px-4 py-2 border border-green-400/30">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Reproduciendo
            </div>
          </div>
        </div>
      )}

      {/* Speed indicator */}
      <div className="fixed bottom-4 right-4 opacity-50">
        <div className="text-white/60 text-sm">
          Velocidad: {speeds.find((s) => s.id === speed)?.label}
        </div>
      </div>

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ReproducerPage;
