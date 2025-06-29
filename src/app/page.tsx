"use client";

import { useState } from "react";
import { Button, SongCard } from "@/components/ui";
import { AddSongModal } from "@/components/modals";
import { NewSongData } from "@/types/song";

interface SavedSong extends NewSongData {
  id: string;
  linesCount: number;
  gradient: string;
  createdAt: Date;
  updatedAt?: Date;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [editingSong, setEditingSong] = useState<SavedSong | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-blue-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
  ];

  const openModal = () => {
    setModalMode("add");
    setEditingSong(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSong(null);
    setModalMode("add");
  };

  const handleSave = (songData: NewSongData) => {
    if (modalMode === "edit" && editingSong) {
      // Actualizar canción existente
      const linesCount = songData.lyrics
        .split("\n")
        .filter((line) => line.trim().length > 0).length;

      const updatedSong: SavedSong = {
        ...editingSong,
        ...songData,
        linesCount,
        updatedAt: new Date(),
      };

      setSongs((prev) =>
        prev.map((song) => (song.id === editingSong.id ? updatedSong : song))
      );

      console.log("Canción actualizada:", updatedSong);
    } else {
      // Crear nueva canción
      const linesCount = songData.lyrics
        .split("\n")
        .filter((line) => line.trim().length > 0).length;
      const randomGradient =
        gradients[Math.floor(Math.random() * gradients.length)];

      const newSong: SavedSong = {
        ...songData,
        id: Date.now().toString(),
        linesCount,
        gradient: randomGradient,
        createdAt: new Date(),
      };

      setSongs((prev) => [newSong, ...prev]);
      console.log("Nueva canción guardada:", newSong);
    }

    closeModal();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Buscando:", e.target.value);
    // Aquí se implementaría la lógica de búsqueda
  };

  const handlePlay = (songId: string, title: string) => {
    console.log(`Reproducir canción: ${title}`);
    // Aquí implementarías la lógica para reproducir la canción
  };

  const handleEdit = (songId: string, title: string) => {
    console.log("handleEdit llamado con:", { songId, title }); // Debug
    const song = songs.find((s) => s.id === songId);
    console.log("Canción encontrada:", song); // Debug
    if (song) {
      setEditingSong(song);
      setModalMode("edit");
      setIsModalOpen(true);
      console.log(`Abriendo modal para editar: ${title}`);
    } else {
      console.log("No se encontró la canción con ID:", songId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="w-full px-4 py-4 sm:px-6 sm:py-6">
        <div className="w-full max-w-none">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Mi Biblioteca de Karaoke
          </h1>

          {/* Search bar and Add button - Mobile First */}
          <div className="w-full space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:items-center">
            {/* Search Input - Full width on mobile */}
            <div className="relative w-full sm:flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar canciones..."
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 text-base shadow-lg"
              />
            </div>

            {/* Add Button - Full width on mobile, auto width on desktop */}
            <div className="w-full sm:w-auto">
              <Button
                label="+ Añadir Canción"
                onClick={openModal}
                variant="success"
                size="medium"
                fullWidth={true}
                className="sm:w-auto sm:min-w-[160px] py-3 sm:py-4"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 pb-8">
        {songs.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
            <div className="text-center max-w-md w-full">
              {/* Music Note Icon */}
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              </div>

              {/* Empty State Text */}
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                No hay canciones guardadas
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg px-4">
                Añade tu primera canción para comenzar
              </p>

              {/* Add Song Button */}
              <div className="px-4">
                <Button
                  label="+ Añadir Canción"
                  onClick={openModal}
                  variant="success"
                  size="large"
                  fullWidth={true}
                  className="sm:w-auto sm:min-w-[200px] sm:mx-auto"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Songs Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Mis Canciones ({songs.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  title={song.title}
                  linesCount={song.linesCount}
                  gradient={song.gradient}
                  onPlay={() => handlePlay(song.id, song.title)}
                  onEdit={() => handleEdit(song.id, song.title)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <AddSongModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingSong={editingSong}
        mode={modalMode}
      />
    </div>
  );
}
