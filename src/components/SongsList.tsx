"use client";

import React, { useState, useEffect } from "react";
import { SongsService } from "@/lib/songsService";
import { DbSong } from "@/types/song";
import { SongCard } from "./ui/SongCard";

export const SongsList: React.FC = () => {
  const [songs, setSongs] = useState<DbSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SongsService.getAllSongs();

      if (result.success && result.songs) {
        setSongs(result.songs);
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

  const handlePlay = (songId: number, title: string) => {
    console.log(`Reproducir canción: ${title} (ID: ${songId})`);
    // Aquí implementarías la lógica para reproducir la canción
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white/70 text-lg">Cargando canciones...</div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-white/70 text-lg mb-2">
            No hay canciones guardadas
          </div>
          <div className="text-white/50 text-sm">
            Agrega tu primera canción para comenzar
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mis Canciones</h2>
        <button
          onClick={loadSongs}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white/80 text-sm transition-colors"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song, index) => (
          <div key={song.id} className="relative group">
            <SongCard
              title={song.title}
              linesCount={getLinesCount(song.lyrics)}
              gradient={generateGradient(index)}
              onPlay={() => handlePlay(song.id, song.title)}
              onEdit={() => handleEdit(song.id, song.title)}
            />

            {/* Botón de eliminar */}
            {/* <buttons
              onClick={() => handleDelete(song.id, song.title)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500/90 backdrop-blur-sm border border-red-400/30 rounded-full text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
              title="Eliminar canción"
            >
              ×
            </buttons> */}
          </div>
        ))}
      </div>
    </div>
  );
};
