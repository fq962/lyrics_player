"use client";

import type React from "react";

import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import VoiceManager from "@/components/voice-manager"
// import LyricsPreview from "@/components/lyrics-preview"
import type { Song, Voice, VoicePart } from "@/types/song";

// Función para generar un ID único sin dependencias externas
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

interface AddSongFormProps {
  onAddSong: (song: Song) => void;
}

export default function AddSongForm({ onAddSong }: AddSongFormProps) {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [voices, setVoices] = useState<Voice[]>([
    // Voz principal (blanca) por defecto
    {
      id: generateId(),
      name: "Voz Principal",
      color: "#FFFFFF",
    },
  ]);
  const [voiceParts, setVoiceParts] = useState<VoicePart[]>([]);
  const [error, setError] = useState("");
  const [selectedText, setSelectedText] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (!title.trim()) {
      setError("Por favor, ingresa el título de la canción");
      return;
    }

    if (!lyrics.trim()) {
      setError("Por favor, ingresa la letra de la canción");
      return;
    }

    // Crear nueva canción
    const newSong: Song = {
      id: generateId(),
      title: title.trim(),
      lyrics: lyrics.trim(),
      voices,
      voiceParts,
      createdAt: new Date().toISOString(),
    };

    // Añadir canción
    onAddSong(newSong);

    // Limpiar formulario
    setTitle("");
    setLyrics("");
    setVoices([
      {
        id: generateId(),
        name: "Voz Principal",
        color: "#FFFFFF",
      },
    ]);
    setVoiceParts([]);
    setError("");
  };

  // Manejar la selección de texto en el textarea
  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      if (start !== end) {
        setSelectedText({ start, end });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-2 rounded-md text-sm font-circular">
          {error}
        </div>
      )}
      <nav
        className="tabs tabs-bordered"
        aria-label="Tabs"
        role="tablist"
        aria-orientation="horizontal"
      >
        <button
          type="button"
          className={`tab active-tab:tab-active ${
            activeTab === "basic" ? "tab-active" : ""
          }`}
          id="tab-basic"
          data-tab="#panel-basic"
          aria-controls="panel-basic"
          role="tab"
          aria-selected={activeTab === "basic"}
          onClick={() => setActiveTab("basic")}
        >
          Información Básica
        </button>
        <button
          type="button"
          className={`tab active-tab:tab-active ${
            activeTab === "voices" ? "tab-active" : ""
          }`}
          id="tab-voices"
          data-tab="#panel-voices"
          aria-controls="panel-voices"
          role="tab"
          aria-selected={activeTab === "voices"}
          onClick={() => setActiveTab("voices")}
        >
          Voces
        </button>
        <button
          type="button"
          className={`tab active-tab:tab-active ${
            activeTab === "preview" ? "tab-active" : ""
          }`}
          id="tab-preview"
          data-tab="#panel-preview"
          aria-controls="panel-preview"
          role="tab"
          aria-selected={activeTab === "preview"}
          onClick={() => setActiveTab("preview")}
        >
          Vista Previa
        </button>
      </nav>

      {/* Panels */}
      <div className="mt-4">
        <div
          id="panel-basic"
          role="tabpanel"
          aria-labelledby="tab-basic"
          className={activeTab === "basic" ? "" : "hidden"}
        >
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-base-content">
                Título de la canción
              </label>
              <input
                type="text"
                className="input max-w"
                aria-label="input"
                placeholder="Ej. Bohemian Rhapsody"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-base-content">
                Letra de la canción
              </label>
              <textarea
                className="textarea max-w"
                aria-label="Textarea"
                placeholder="Pega aquí la letra de la canción..."
                rows={6}
              />
            </div>
            <button
              className="btn btn-success w-full"
              onClick={() => console.log("Añadir Canción")}
            >
              Añadir Canción
            </button>
          </form>
        </div>

        <div
          id="panel-voices"
          role="tabpanel"
          aria-labelledby="tab-voices"
          className={activeTab === "voices" ? "" : "hidden"}
        >
          <p className="text-base-content/80">
            Contenido de la pestaña <strong>Voces</strong> aquí.
          </p>
        </div>

        <div
          id="panel-preview"
          role="tabpanel"
          aria-labelledby="tab-preview"
          className={activeTab === "preview" ? "" : "hidden"}
        >
          <p className="text-base-content/80">
            Aquí puedes ver la <strong>Vista Previa</strong>.
          </p>
        </div>
      </div>
    </form>
  );
}
