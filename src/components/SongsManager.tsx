"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as _ from "lodash";
import { SongsService } from "@/lib/songsService";
import {
  DbSong,
  NewSongData,
  Voice,
  TextAssignment,
  DbVoice,
  DbVoiceSegment,
} from "@/types/song";
import { SongCard } from "./ui/SongCard";
import { AddSongModal } from "./modals/AddSongModal";
import { Button } from "./ui/Button";

export const SongsManager: React.FC = () => {
  const router = useRouter();
  const [songs, setSongs] = useState<
    (DbSong & {
      voices: DbVoice[];
      voice_segments: DbVoiceSegment[];
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SongsService.getAllSongs();

      if (result.success && result.songs) {
        // Ordenar las canciones por título antes de setearlas
        const sortedSongs = _.orderBy(result.songs, ["id"], ["asc"]);
        setSongs(sortedSongs);
      } else {
        setError(result.error || "Error al cargar las canciones");
      }
    } catch (error) {
      console.error("Error al cargar canciones:", error);
      setError("Error inesperado al cargar las canciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleSaveSong = async (
    songData: NewSongData,
    voices: Voice[],
    textAssignments: TextAssignment[]
  ) => {
    setIsLoading(true);
    setSaveError(null);

    try {
      const result = await SongsService.saveSong(
        songData,
        voices,
        textAssignments
      );

      if (result.success) {
        console.log("Canción guardada exitosamente:", result.songId);
        setIsModalOpen(false);
        // Recargar la lista de canciones
        await loadSongs();
      } else {
        setSaveError(result.error || "Error al guardar la canción");
        throw new Error(result.error || "Error al guardar la canción");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setSaveError("Error inesperado al guardar la canción");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (songId: number) => {
    // Buscar la canción completa para obtener las letras
    const song = songs.find((s) => s.id === songId);
    if (song) {
      // Navegar a la página del reproductor con los parámetros
      const params = new URLSearchParams({
        id: song.id.toString(),
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

      router.push(`/player?${params.toString()}`);
    }
  };

  const handleEdit = (songId: number, title: string) => {
    console.log(`Editar canción: ${title} (ID: ${songId})`);
    // Aquí implementarías la lógica para editar la canción
  };

  // const handleDelete = async (songId: number, title: string) => {
  //   if (window.confirm(`¿Estás seguro de que quieres eliminar "${title}"?`)) {
  //     try {
  //       const result = await SongsService.deleteSong(songId);

  //       if (result.success) {
  //         setSongs(songs.filter((song) => song.id !== songId));
  //       } else {
  //         setError(result.error || "Error al eliminar la canción");
  //       }
  //     } catch (error) {
  //       console.error("Error al eliminar canción:", error);
  //       setError("Error inesperado al eliminar la canción");
  //     }
  //   }
  // };

  const generateGradient = (index: number) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-orange-500 to-red-500",
      "from-green-500 to-blue-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-purple-500",
      "from-cyan-500 to-blue-500",
      "from-red-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  const getLinesCount = (lyrics: string) => {
    return lyrics.split("\n").filter((line) => line.trim()).length;
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSaveError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSaveError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Lyrics Player</h1>
          <div className="flex items-center gap-4">
            <Button
              label="Añadir Canción"
              onClick={openModal}
              variant="primary"
              size="medium"
              disabled={isLoading}
            />
            <button
              onClick={loadSongs}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white/80 text-sm transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Error de guardado */}
        {saveError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-2xl">
            <p className="text-red-200 text-sm">{saveError}</p>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-2xl">
            <p className="text-blue-200 text-sm">Guardando canción...</p>
          </div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white/70 text-lg">Cargando canciones...</div>
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-2xl">
              <p className="text-red-200 text-sm">{error}</p>
              <button
                onClick={loadSongs}
                className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 border border-red-400/50 rounded-xl text-red-200 text-sm transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : songs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-white/70 text-lg mb-2">
                No hay canciones guardadas
              </div>
              <div className="text-white/50 text-sm mb-4">
                Agrega tu primera canción para comenzar
              </div>
              <Button
                label="Añadir Primera Canción"
                onClick={openModal}
                variant="primary"
                size="medium"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {songs.map((song, index) => (
              <div key={song.id} className="relative group">
                <SongCard
                  title={song.title}
                  linesCount={getLinesCount(song.lyrics)}
                  gradient={generateGradient(index)}
                  onPlay={() => handlePlay(song.id)}
                  onEdit={() => handleEdit(song.id, song.title)}
                />

                {/* Botón de eliminar */}
                {/* <button
                  onClick={() => handleDelete(song.id, song.title)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500/90 backdrop-blur-sm border border-red-400/30 rounded-full text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  title="Eliminar canción"
                >
                  ×
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddSongModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveSong}
        mode="add"
      />
    </div>
  );
};
