"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";

interface Voice {
  id: number;
  name: string;
  color: string;
}

interface VoiceSegment {
  id: number;
  start_pos: number;
  end_pos: number;
  voice_id: number;
}

interface PlayerSong {
  id: string;
  title: string;
  lyrics: string;
  artist?: string;
  linesCount: number;
  voices?: Voice[];
  voice_segments?: VoiceSegment[];
}

// Componente separado que usa useSearchParams
const PlayerContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [song, setSong] = useState<PlayerSong | null>(null);
  const [speed, setSpeed] = useState<
    "lenta" | "normal" | "rapida" | "muy-rapida"
  >("normal");

  useEffect(() => {
    // En una implementación real, obtendrías los datos de la canción desde una API o store
    // Por ahora, usaremos datos simulados basados en los parámetros de la URL
    if (searchParams) {
      const songId = searchParams.get("id");
      const title = searchParams.get("title") || "Título de la canción";
      const lyrics = searchParams.get("lyrics") || "Letra de la canción...";
      const voicesParam = searchParams.get("voices");
      const voiceSegmentsParam = searchParams.get("voice_segments");

      if (songId) {
        let voices: Voice[] = [];
        let voice_segments: VoiceSegment[] = [];

        // Parsear voices si existen
        if (voicesParam) {
          try {
            voices = JSON.parse(decodeURIComponent(voicesParam));
          } catch (e) {
            console.error("Error parsing voices:", e);
          }
        }

        // Parsear voice_segments si existen
        if (voiceSegmentsParam) {
          try {
            voice_segments = JSON.parse(decodeURIComponent(voiceSegmentsParam));
          } catch (e) {
            console.error("Error parsing voice_segments:", e);
          }
        }

        setSong({
          id: songId,
          title: decodeURIComponent(title),
          lyrics: decodeURIComponent(lyrics),
          linesCount: lyrics.split("\n").length,
          voices,
          voice_segments,
        });
      }
    }
  }, [searchParams]);

  const handleBack = () => {
    router.back();
  };

  const togglePlay = () => {
    if (song) {
      // Navegar a la página reproducer con los datos de la canción
      const params = new URLSearchParams({
        id: song.id,
        title: encodeURIComponent(song.title),
        lyrics: encodeURIComponent(song.lyrics),
      });

      // Agregar voces y segmentos si existen
      if (song.voices && song.voices.length > 0) {
        params.append(
          "voices",
          encodeURIComponent(JSON.stringify(song.voices))
        );
      }
      if (song.voice_segments && song.voice_segments.length > 0) {
        params.append(
          "voice_segments",
          encodeURIComponent(JSON.stringify(song.voice_segments))
        );
      }

      router.push(`/reproducer?${params.toString()}`);
    }
  };

  const speeds = [
    { id: "lenta", label: "Lenta" },
    { id: "normal", label: "Normal" },
    { id: "rapida", label: "Rápida" },
    { id: "muy-rapida", label: "Muy Rápida" },
  ] as const;

  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="w-full px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
            {song.title}
          </h1>
        </div>
      </header>

      {/* Controls Section */}
      <main className="flex-1 px-4 sm:px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 mb-6">
            {/* Speed Controls */}
            <div className="mb-6">
              <p className="text-white/80 text-sm mb-3">
                Velocidad de desplazamiento:
              </p>
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {speeds.map((speedOption) => (
                    <Button
                      key={speedOption.id}
                      label={speedOption.label}
                      onClick={() => setSpeed(speedOption.id)}
                      variant={speed === speedOption.id ? "success" : "outline"}
                      size="small"
                      className={
                        speed === speedOption.id
                          ? "!bg-green-500/80 !text-white !border-green-400/30"
                          : "!text-white/80 hover:!text-white"
                      }
                    />
                  ))}
                </div>

                {/* Reproducir Button */}
                <Button
                  label="Reproducir"
                  onClick={togglePlay}
                  variant="primary"
                  size="medium"
                  className="!bg-gradient-to-r !from-pink-500/80 !to-purple-500/80 hover:!from-pink-500/90 hover:!to-purple-500/90 !text-white !border-pink-400/30"
                />
              </div>
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              {/* Gradient overlay for lyrics background */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl" />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="prose prose-invert max-w-none">
                    <div className="text-white whitespace-pre-line text-base leading-relaxed">
                      {song.lyrics}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente de fallback para el loading
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-white">Cargando player...</div>
  </div>
);

// Componente principal envuelto en Suspense
const PlayerPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PlayerContent />
    </Suspense>
  );
};

export default PlayerPage;
