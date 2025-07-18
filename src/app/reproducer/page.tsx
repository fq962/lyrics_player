"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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

interface ReproducerSong {
  id: string;
  title: string;
  lyrics: string;
  artist?: string;
  linesCount: number;
  voices?: Voice[];
  voice_segments?: VoiceSegment[];
}

// Componente separado que usa useSearchParams
const ReproducerContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [song, setSong] = useState<ReproducerSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<
    "lenta" | "normal" | "rapida" | "muy-rapida"
  >("normal");
  const [fontSize, setFontSize] = useState<
    "pequena" | "normal" | "grande" | "muy-grande"
  >("normal");

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Velocidades de scroll en píxeles por segundo
  const speedMultipliers = {
    lenta: 30,
    normal: 60,
    rapida: 120,
    "muy-rapida": 180,
  };

  // Tamaños de fuente
  const fontSizeClasses = {
    pequena: "text-3xl md:text-4xl lg:text-5xl",
    normal: "text-5xl md:text-6xl lg:text-7xl",
    grande: "text-6xl md:text-7xl lg:text-8xl",
    "muy-grande": "text-7xl md:text-8xl lg:text-9xl",
  };

  useEffect(() => {
    if (searchParams) {
      const songId = searchParams.get("id");
      const title = searchParams.get("title") || "Título de la canción";
      const lyrics = searchParams.get("lyrics") || "Letra de la canción...";
      const voicesParam = searchParams.get("voices");
      const voiceSegmentsParam = searchParams.get("voice_segments");

      console.log("=== DEBUGGING REPRODUCER ===");
      console.log("songId:", songId);
      console.log("voicesParam:", voicesParam);
      console.log("voiceSegmentsParam:", voiceSegmentsParam);

      if (songId) {
        let voices: Voice[] = [];
        let voice_segments: VoiceSegment[] = [];

        // Parsear voices si existen
        if (voicesParam) {
          try {
            voices = JSON.parse(decodeURIComponent(voicesParam));
            console.log("Parsed voices:", voices);
          } catch (e) {
            console.error("Error parsing voices:", e);
          }
        }

        // Parsear voice_segments si existen
        if (voiceSegmentsParam) {
          try {
            voice_segments = JSON.parse(decodeURIComponent(voiceSegmentsParam));
            console.log("Parsed voice_segments:", voice_segments);
          } catch (e) {
            console.error("Error parsing voice_segments:", e);
          }
        }

        const songData = {
          id: songId,
          title: decodeURIComponent(title),
          lyrics: decodeURIComponent(lyrics),
          linesCount: lyrics.split("\n").length,
          voices,
          voice_segments,
        };

        console.log("Final song data:", songData);
        setSong(songData);
      }
    }
  }, [searchParams]);

  // Función para renderizar la letra línea por línea con colores
  const renderLyricsWithColors = () => {
    if (!song?.lyrics) return null;

    const lyrics = song.lyrics;
    const lines = lyrics.split("\n");

    console.log("=== RENDERING LYRICS ===");
    console.log("Song voices:", song.voices);
    console.log("Song voice_segments:", song.voice_segments);
    console.log("Lines count:", lines.length);

    // Si no hay segmentos, renderizar normalmente
    if (
      !song.voices ||
      !song.voice_segments ||
      song.voice_segments.length === 0
    ) {
      console.log("No voices or segments found, rendering normally");
      return lines.map((line, index) => (
        <div
          key={index}
          className="mb-4 text-white opacity-90"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {line || "\u00A0"}
        </div>
      ));
    }

    console.log("Processing lines with colors...");

    // Crear un array de caracteres con sus colores
    const textWithColors = [];
    let currentPos = 0;

    // Ordenar segmentos por posición
    const sortedSegments = [...song.voice_segments].sort(
      (a, b) => a.start_pos - b.start_pos
    );

    for (const segment of sortedSegments) {
      // Agregar texto antes del segmento (sin color)
      if (currentPos < segment.start_pos) {
        for (let i = currentPos; i < segment.start_pos; i++) {
          textWithColors.push({
            char: lyrics[i],
            color: "#ffffff",
            voiceId: null,
          });
        }
      }

      // Agregar texto del segmento con color
      const voice = song.voices?.find((v) => v.id === segment.voice_id);
      for (let i = segment.start_pos; i < segment.end_pos; i++) {
        textWithColors.push({
          char: lyrics[i],
          color: voice?.color || "#ffffff",
          voiceId: segment.voice_id,
        });
      }

      currentPos = segment.end_pos;
    }

    // Agregar texto restante
    if (currentPos < lyrics.length) {
      for (let i = currentPos; i < lyrics.length; i++) {
        textWithColors.push({
          char: lyrics[i],
          color: "#ffffff",
          voiceId: null,
        });
      }
    }

    // Convertir a líneas con colores
    const linesWithColors = [];
    let currentLine = [];
    let currentColor = "#ffffff";
    let currentVoiceId = null;

    for (let i = 0; i < textWithColors.length; i++) {
      const item = textWithColors[i];

      if (item.char === "\n") {
        // Finalizar línea actual
        if (currentLine.length > 0) {
          linesWithColors.push([...currentLine]);
          currentLine = [];
        }
        linesWithColors.push([]);
        continue;
      }

      // Si el color cambia, finalizar el span actual
      if (item.color !== currentColor || item.voiceId !== currentVoiceId) {
        if (currentLine.length > 0) {
          // Agregar span con el color anterior
          const spanText = currentLine.join("");
          linesWithColors.push({
            text: spanText,
            color: currentColor,
            voiceId: currentVoiceId,
          });
          currentLine = [];
        }
        currentColor = item.color;
        currentVoiceId = item.voiceId;
      }

      currentLine.push(item.char);
    }

    // Agregar último span si existe
    if (currentLine.length > 0) {
      const spanText = currentLine.join("");
      linesWithColors.push({
        text: spanText,
        color: currentColor,
        voiceId: currentVoiceId,
      });
    }

    console.log("Lines with colors:", linesWithColors);

    // Renderizar las líneas
    return lines.map((line, lineIndex) => {
      if (!line) {
        return (
          <div
            key={lineIndex}
            className="mb-4"
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {"\u00A0"}
          </div>
        );
      }

      let lineStart = 0;
      for (let i = 0; i < lineIndex; i++) {
        lineStart += lines[i].length + 1; // +1 for \n
      }
      const lineEnd = lineStart + line.length;

      const lineSegments = [];
      let processed = lineStart;

      // Encontrar segmentos que afectan esta línea
      for (const segment of sortedSegments) {
        if (segment.start_pos >= lineEnd || segment.end_pos <= lineStart) {
          continue; // El segmento no afecta esta línea
        }

        const segmentStart = Math.max(segment.start_pos, lineStart);
        const segmentEnd = Math.min(segment.end_pos, lineEnd);

        // Texto antes del segmento
        if (processed < segmentStart) {
          const text = lyrics.substring(processed, segmentStart);
          lineSegments.push(
            <span
              key={`${lineIndex}-${processed}`}
              className="text-white opacity-90"
            >
              {text}
            </span>
          );
        }

        // Texto del segmento con color
        const voice = song.voices?.find((v) => v.id === segment.voice_id);
        const segmentText = lyrics.substring(segmentStart, segmentEnd);

        console.log(
          `Line ${lineIndex}: segment "${segmentText}" with color ${voice?.color}`
        );

        lineSegments.push(
          <span
            key={`${lineIndex}-${segment.id}`}
            style={{ color: voice?.color || "#ffffff" }}
            className="opacity-90 font-medium"
          >
            {segmentText}
          </span>
        );

        processed = segmentEnd;
      }

      // Texto restante en la línea
      if (processed < lineEnd) {
        const text = lyrics.substring(processed, lineEnd);
        lineSegments.push(
          <span
            key={`${lineIndex}-${processed}`}
            className="text-white opacity-90"
          >
            {text}
          </span>
        );
      }

      return (
        <div
          key={lineIndex}
          className="mb-4"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {lineSegments.length > 0 ? lineSegments : line || "\u00A0"}
        </div>
      );
    });
  };

  // Efecto para controlar el scroll automático
  useEffect(() => {
    if (isPlaying && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const speedPixelsPerSecond = speedMultipliers[speed];

      const scrollFunction = (currentTime: number) => {
        if (!isPlaying || !container) return;

        if (lastFrameTimeRef.current === 0) {
          lastFrameTimeRef.current = currentTime;
        }

        const deltaTime = currentTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = currentTime;

        // Calcular cuántos píxeles mover basado en el tiempo transcurrido
        const pixelsToMove = (speedPixelsPerSecond * deltaTime) / 1000;

        const currentScrollTop = container.scrollTop;
        const maxScrollTop = container.scrollHeight - container.clientHeight;

        // Si llegamos al final, reiniciamos desde el principio
        if (currentScrollTop >= maxScrollTop - 10) {
          container.scrollTop = 0;
          lastFrameTimeRef.current = currentTime; // Reset time reference
        } else {
          // Scroll hacia abajo de manera suave
          container.scrollTop += pixelsToMove;
        }

        // Continuar la animación
        scrollAnimationRef.current = requestAnimationFrame(scrollFunction);
      };

      // Iniciar la animación
      lastFrameTimeRef.current = 0;
      scrollAnimationRef.current = requestAnimationFrame(scrollFunction);
    } else {
      // Limpiar la animación cuando se pausa
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      lastFrameTimeRef.current = 0;
    }

    // Cleanup al desmontar o cambiar dependencias
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      lastFrameTimeRef.current = 0;
    };
  }, [isPlaying, speed, speedMultipliers]);

  const handleBack = () => {
    router.back();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Función temporal para probar con datos de ejemplo
  const testWithSampleData = () => {
    const sampleSong = {
      id: "test",
      title: "Test Song",
      lyrics:
        "Solitaria camina la bikina\nLa gente se pone a murmurar\nDicen que tiene una pena\nDicen que tiene una pena que la hace llorar",
      linesCount: 4,
      voices: [
        { id: 3, name: "Voz Principal", color: "#ffffff" },
        { id: 4, name: "Voz 2", color: "#ef4444" },
        { id: 5, name: "Voz 3", color: "#10b981" },
      ],
      voice_segments: [
        { id: 2, start_pos: 0, end_pos: 30, voice_id: 3 },
        { id: 3, start_pos: 31, end_pos: 60, voice_id: 4 },
        { id: 4, start_pos: 61, end_pos: 90, voice_id: 5 },
      ],
    };

    console.log("Setting sample data:", sampleSong);
    setSong(sampleSong);
  };

  const speeds = [
    { id: "lenta", label: "Lenta" },
    { id: "normal", label: "Normal" },
    { id: "rapida", label: "Rápida" },
    { id: "muy-rapida", label: "Muy Rápida" },
  ] as const;

  const fontSizes = [
    { id: "pequena", label: "P" },
    { id: "normal", label: "N" },
    { id: "grande", label: "G" },
    { id: "muy-grande", label: "MG" },
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
            {song?.title.toUpperCase() || "CARGANDO..."}
          </h1>
          {/* Botón temporal para probar */}
          <button
            onClick={testWithSampleData}
            className="px-3 py-1 bg-yellow-500/80 hover:bg-yellow-500/90 text-black text-sm rounded-lg font-medium"
          >
            Test Colors
          </button>
        </div>

        {/* Right side - Speed controls and Font size controls */}
        <div className="flex items-center gap-4">
          {/* Speed controls */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">Velocidad:</span>
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
          </div>

          {/* Font size controls */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">Tamaño:</span>
            {fontSizes.map((sizeOption) => (
              <Button
                key={sizeOption.id}
                label={sizeOption.label}
                onClick={() => setFontSize(sizeOption.id)}
                variant={fontSize === sizeOption.id ? "success" : "ghost"}
                size="small"
                className={
                  fontSize === sizeOption.id
                    ? "!bg-blue-500/20 !text-blue-400 !border-blue-400/30"
                    : "!text-white/60 hover:!text-white/80 !bg-transparent !border-transparent"
                }
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="ml-2 p-2 text-white/80 hover:text-white transition-colors"
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
            <div
              className={`${fontSizeClasses[fontSize]} font-bold leading-tight tracking-wide`}
            >
              {/* Espacio inicial para que el texto comience desde el centro */}
              <div className="h-screen"></div>

              {/* Renderizar letra con colores */}
              {renderLyricsWithColors()}

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

      {/* Voices legend */}
      {song.voices && song.voices.length > 1 && (
        <div className="fixed top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/20">
          <h4 className="text-white/80 text-xs font-medium mb-2">Voces:</h4>
          <div className="space-y-1">
            {song.voices.map((voice) => (
              <div key={voice.id} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: voice.color }}
                />
                <span className="text-white/70 text-xs">{voice.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

// Componente de fallback para el loading
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white">Cargando reproductor...</div>
  </div>
);

// Componente principal envuelto en Suspense
const ReproducerPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReproducerContent />
    </Suspense>
  );
};

export default ReproducerPage;
