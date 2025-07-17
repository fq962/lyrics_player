"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SongModalProps,
  SongModalTab,
  NewSongData,
  Voice,
  TextAssignment,
} from "@/types/song";
import { Button } from "@/components/ui/Button";

export const AddSongModal: React.FC<SongModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSong = null,
  mode = "add",
}) => {
  const [activeTab, setActiveTab] = useState<SongModalTab>("basic");
  const [formData, setFormData] = useState<NewSongData>({
    title: "",
    lyrics: "",
    artist: "",
  });
  const [voices, setVoices] = useState<Voice[]>([
    { id: "1", name: "Voz Principal", color: "#ffffff" },
  ]);
  const [newVoiceName, setNewVoiceName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ef4444");
  const [textAssignments, setTextAssignments] = useState<TextAssignment[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectedTextIndices, setSelectedTextIndices] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pre-llenar datos cuando se está editando
  useEffect(() => {
    if (isOpen && editingSong && mode === "edit") {
      setFormData({
        title: editingSong.title,
        lyrics: editingSong.lyrics,
        artist: editingSong.artist || "",
      });
    } else if (isOpen && mode === "add") {
      // Reset para modo agregar
      setFormData({
        title: "",
        lyrics: "",
        artist: "",
      });
    }
  }, [isOpen, editingSong, mode]);

  const colors = [
    "#ef4444", // red
    "#f59e0b", // yellow
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f97316", // orange
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#6366f1", // indigo
  ];

  const handleInputChange = (field: keyof NewSongData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      if (start !== end) {
        const selected = formData.lyrics.substring(start, end);
        setSelectedText(selected);
        setSelectedTextIndices({ start, end });
      } else {
        setSelectedText("");
        setSelectedTextIndices(null);
      }
    }
  };

  const handleAddVoice = () => {
    if (newVoiceName.trim()) {
      const newVoice: Voice = {
        id: Date.now().toString(),
        name: newVoiceName.trim(),
        color: selectedColor,
      };
      setVoices([...voices, newVoice]);
      setNewVoiceName("");
    }
  };

  const handleAssignVoice = (voiceId: string) => {
    if (selectedText && selectedTextIndices) {
      // Check if there's already an assignment for this text range
      const existingAssignment = textAssignments.find(
        (assignment) =>
          assignment.startIndex === selectedTextIndices.start &&
          assignment.endIndex === selectedTextIndices.end
      );

      if (existingAssignment) {
        // Update existing assignment
        setTextAssignments((prev) =>
          prev.map((assignment) =>
            assignment.id === existingAssignment.id
              ? { ...assignment, voiceId }
              : assignment
          )
        );
      } else {
        // Create new assignment
        const newAssignment: TextAssignment = {
          id: Date.now().toString(),
          text: selectedText,
          voiceId,
          startIndex: selectedTextIndices.start,
          endIndex: selectedTextIndices.end,
        };
        setTextAssignments((prev) => [...prev, newAssignment]);
      }

      // Clear selection
      setSelectedText("");
      setSelectedTextIndices(null);
      if (textareaRef.current) {
        textareaRef.current.selectionStart =
          textareaRef.current.selectionEnd = 0;
      }
    }
  };

  const removeAssignment = (assignmentId: string) => {
    setTextAssignments((prev) =>
      prev.filter((assignment) => assignment.id !== assignmentId)
    );
  };

  const renderLyricsWithColors = () => {
    if (!formData.lyrics) return "La letra aparecerá aquí...";

    const result = [];
    let currentIndex = 0;

    // Sort assignments by start index
    const sortedAssignments = [...textAssignments].sort(
      (a, b) => a.startIndex - b.startIndex
    );

    for (const assignment of sortedAssignments) {
      // Add text before assignment
      if (currentIndex < assignment.startIndex) {
        result.push(
          <span key={`text-${currentIndex}`} className="text-white/80">
            {formData.lyrics.substring(currentIndex, assignment.startIndex)}
          </span>
        );
      }

      // Add assigned text with color
      const voice = voices.find((v) => v.id === assignment.voiceId);
      result.push(
        <span
          key={`assignment-${assignment.id}`}
          style={{ color: voice?.color || "#ffffff" }}
          className="font-medium"
        >
          {assignment.text}
        </span>
      );

      currentIndex = assignment.endIndex;
    }

    // Add remaining text
    if (currentIndex < formData.lyrics.length) {
      result.push(
        <span key={`text-${currentIndex}`} className="text-white/80">
          {formData.lyrics.substring(currentIndex)}
        </span>
      );
    }

    return result;
  };

  const handleSave = async () => {
    if (formData.title.trim() && formData.lyrics.trim()) {
      setIsLoading(true);
      setError(null);

      try {
        await onSave(formData, voices, textAssignments);

        // Solo resetear si es modo agregar
        if (mode === "add") {
          setFormData({
            title: "",
            lyrics: "",
            artist: "",
          });
          setVoices([{ id: "1", name: "Voz Principal", color: "#ffffff" }]);
          setNewVoiceName("");
          setTextAssignments([]);
          setSelectedText("");
          setSelectedTextIndices(null);
        }

        setActiveTab("basic");
        onClose();
      } catch (error) {
        console.error("Error al guardar:", error);
        setError("Error al guardar la canción");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    // Solo resetear si es modo agregar
    if (mode === "add") {
      setFormData({
        title: "",
        lyrics: "",
        artist: "",
      });
      setVoices([{ id: "1", name: "Voz Principal", color: "#ffffff" }]);
      setNewVoiceName("");
      setTextAssignments([]);
      setSelectedText("");
      setSelectedTextIndices(null);
    }
    setActiveTab("basic");
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "basic" as SongModalTab, label: "Información Básica" },
    { id: "voices" as SongModalTab, label: "Voces" },
    { id: "preview" as SongModalTab, label: "Vista Previa" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/15">
          <h2 className="text-lg font-medium text-white/90">
            {mode === "edit" ? "Editar Canción" : "Añadir Nueva Canción"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white/90 transition-all duration-300 text-xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-2xl">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/15">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white/20 text-white/95 border-b-2 border-white/50"
                  : "text-white/70 hover:text-white/90 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[50vh]">
          {activeTab === "basic" && (
            <div className="space-y-4">
              {/* Título de la canción */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Título de la canción
                  {selectedText && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-lg">
                      Texto seleccionado: &ldquo;
                      {selectedText.length > 30
                        ? selectedText.substring(0, 30) + "..."
                        : selectedText}
                      &rdquo;
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej. Bohemian Rhapsody"
                  className="w-full px-3 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 focus:bg-white/20 transition-all duration-300 text-sm"
                />
              </div>

              {/* Letra de la canción */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Letra de la canción
                </label>
                <textarea
                  ref={textareaRef}
                  value={formData.lyrics}
                  onChange={(e) => handleInputChange("lyrics", e.target.value)}
                  onSelect={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                  placeholder="Pega aquí la letra de la canción..."
                  rows={8}
                  className="w-full px-3 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 focus:bg-white/20 transition-all duration-300 resize-none text-sm"
                />
                <p className="text-white/60 text-xs mt-1">
                  💡 Selecciona partes del texto para asignarlas a voces en la
                  pestaña &ldquo;Voces&rdquo;
                </p>
              </div>
            </div>
          )}

          {activeTab === "voices" && (
            <div className="space-y-6">
              {/* Texto seleccionado */}
              {selectedText && (
                <div className="p-3 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-2xl">
                  <p className="text-blue-200 text-sm font-medium mb-1">
                    Texto seleccionado:
                  </p>
                  <p className="text-white/90 text-sm">
                    &ldquo;{selectedText}&rdquo;
                  </p>
                  <p className="text-blue-200/80 text-xs mt-1">
                    Haz clic en &ldquo;Asignar&rdquo; junto a una voz para
                    asignar este texto
                  </p>
                </div>
              )}

              {/* Añadir nueva voz */}
              <div>
                <h3 className="text-white/80 text-base font-medium mb-3">
                  Añadir nueva voz
                </h3>
                <input
                  type="text"
                  value={newVoiceName}
                  onChange={(e) => setNewVoiceName(e.target.value)}
                  placeholder="Nombre de la voz"
                  className="w-full px-3 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 focus:bg-white/20 transition-all duration-300 text-sm mb-3"
                />

                {/* Color picker */}
                <div className="flex items-center gap-2 mb-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all duration-200 ${
                        selectedColor === color
                          ? "ring-2 ring-white/50 ring-offset-2 ring-offset-transparent scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleAddVoice}
                  disabled={!newVoiceName.trim()}
                  className="px-4 py-2 bg-green-500/80 hover:bg-green-500/90 disabled:bg-white/10 disabled:text-white/40 backdrop-blur-md border border-green-400/30 disabled:border-white/20 rounded-2xl text-white/90 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed"
                >
                  + Añadir
                </button>
              </div>

              {/* Voces disponibles */}
              <div>
                <h3 className="text-white/80 text-base font-medium mb-3">
                  Voces disponibles
                </h3>
                <div className="space-y-2">
                  {voices.map((voice) => (
                    <div
                      key={voice.id}
                      className="flex items-center justify-between p-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: voice.color }}
                        />
                        <span className="text-white/90 text-sm font-medium">
                          {voice.name}
                        </span>
                        {voice.name === "Voz Principal" && (
                          <span className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white/70 text-xs">
                            Principal
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAssignVoice(voice.id)}
                        disabled={!selectedText}
                        className={`px-3 py-1 backdrop-blur-md border rounded-xl text-sm transition-all duration-300 ${
                          selectedText
                            ? "bg-white/15 hover:bg-white/25 border-white/30 text-white/80 hover:text-white/90 cursor-pointer"
                            : "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                        }`}
                      >
                        ✓ Asignar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partes asignadas */}
              <div>
                <h3 className="text-white/80 text-base font-medium mb-3">
                  Partes asignadas
                </h3>
                {textAssignments.length === 0 ? (
                  <div className="p-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl">
                    <p className="text-white/60 text-sm text-center">
                      No hay partes asignadas
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {textAssignments.map((assignment) => {
                      const voice = voices.find(
                        (v) => v.id === assignment.voiceId
                      );
                      return (
                        <div
                          key={assignment.id}
                          className="flex items-start justify-between p-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                              style={{ backgroundColor: voice?.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white/90 text-sm font-medium mb-1">
                                {voice?.name}
                              </p>
                              <p className="text-white/70 text-xs truncate">
                                &ldquo;{assignment.text}&rdquo;
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAssignment(assignment.id)}
                            className="ml-2 text-red-400/60 hover:text-red-400/90 text-sm transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cómo usar */}
              <div>
                <h3 className="text-white/80 text-base font-medium mb-3">
                  Cómo usar
                </h3>
                <div className="space-y-2 text-white/70 text-sm">
                  <p>1. Añade las voces que necesites para la canción</p>
                  <p>
                    2. Selecciona una parte del texto en la pestaña
                    &ldquo;Información Básica&rdquo;
                  </p>
                  <p>
                    3. Haz clic en &ldquo;Asignar&rdquo; junto a la voz deseada
                  </p>
                  <p>
                    4. La parte seleccionada se mostrará en el color de esa voz
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-3">
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4">
                <h3 className="text-white/90 text-base font-medium mb-2">
                  {formData.title || "Título de la canción"}
                </h3>
                <div className="text-sm max-h-40 overflow-y-auto whitespace-pre-line">
                  {renderLyricsWithColors()}
                </div>
              </div>
              {textAssignments.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-3">
                  <h4 className="text-white/80 text-sm font-medium mb-2">
                    Leyenda de voces:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {voices
                      .filter((voice) =>
                        textAssignments.some((a) => a.voiceId === voice.id)
                      )
                      .map((voice) => (
                        <div key={voice.id} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: voice.color }}
                          />
                          <span className="text-white/70 text-xs">
                            {voice.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/15">
          <div className="flex justify-end">
            <Button
              label={
                isLoading
                  ? "Guardando..."
                  : mode === "edit"
                  ? "Actualizar Canción"
                  : "Guardar Canción"
              }
              onClick={handleSave}
              variant="success"
              size="medium"
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/30 text-white/90 font-medium min-w-[140px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSongModal;
