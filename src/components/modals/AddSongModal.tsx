"use client";

import React, { useState } from "react";
import { SongModalProps, SongModalTab, NewSongData } from "@/types/song";
import { Button } from "@/components/ui/Button";

export const AddSongModal: React.FC<SongModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<SongModalTab>("basic");
  const [formData, setFormData] = useState<NewSongData>({
    title: "",
    lyrics: "",
    artist: "",
  });

  const handleInputChange = (field: keyof NewSongData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (formData.title.trim() && formData.lyrics.trim()) {
      onSave(formData);
      // Reset form
      setFormData({
        title: "",
        lyrics: "",
        artist: "",
      });
      setActiveTab("basic");
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: "",
      lyrics: "",
      artist: "",
    });
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
            Añadir Nueva Canción
          </h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white/90 transition-all duration-300 text-xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15"
          >
            ×
          </button>
        </div>

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
                  value={formData.lyrics}
                  onChange={(e) => handleInputChange("lyrics", e.target.value)}
                  placeholder="Pega aquí la letra de la canción..."
                  rows={8}
                  className="w-full px-3 py-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 focus:bg-white/20 transition-all duration-300 resize-none text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === "voices" && (
            <div className="flex items-center justify-center h-32">
              <p className="text-white/60 text-sm">
                Configuración de voces próximamente...
              </p>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-3">
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4">
                <h3 className="text-white/90 text-base font-medium mb-2">
                  {formData.title || "Título de la canción"}
                </h3>
                <div className="text-white/80 whitespace-pre-line text-sm max-h-40 overflow-y-auto">
                  {formData.lyrics || "La letra aparecerá aquí..."}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/15">
          <div className="flex justify-end">
            <Button
              label="Guardar Canción"
              onClick={handleSave}
              variant="success"
              size="medium"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/30 text-white/90 font-medium min-w-[140px] shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSongModal;
