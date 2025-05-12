"use client";

import AddSongForm from "@/components/AddSongForm";
import { Song } from "@/types/song";
import { useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // Filtrar canciones según la búsqueda
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Contar el número de voces en una canción
  const countVoices = (song: Song) => {
    return song.voices?.length || 1;
  };

  // Añadir una nueva canción
  const handleAddSong = (newSong: Song) => {
    const updatedSongs = [...songs, newSong];
    setSongs(updatedSongs);
    localStorage.setItem("karaokeSongs", JSON.stringify(updatedSongs));
    setShowAddForm(false); // Ocultar el formulario después de guardar
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-b from-purple-900/80 to-black p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold font-circular mb-6">
            Mi Biblioteca de Karaoke
          </h1>

          {/* Barra de búsqueda y botón de añadir */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
              <input
                type="text"
                placeholder="Buscar canciones..."
                className="input max-w"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success"
              onClick={() => setShowAddForm(true)}
            >
              Añadir Canción
            </button>
          </div>
        </div>
      </header>

      {/* Formulario para añadir canción */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-circular text-xl">Añadir Nueva Canción</h2>
              <button
                // variant="ghost"
                // size="icon"
                onClick={() => console.log("Close")}
                className="text-gray-400 hover:text-white"
              >
                {/* <X className="h-5 w-5" /> */}
              </button>
            </div>
            <div className="overflow-y-auto pr-2 flex-grow">
              <AddSongForm onAddSong={handleAddSong} />
              {/* <AddSongForm onAddSong={handleAddSong} /> */}
            </div>
          </div>
        </div>
      )}

      {/* Formulario para editar canción */}
      {editingSong && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-circular text-xl">Editar Canción</h2>
              <button
                onClick={() => console.log("Close")}
                className="text-gray-400 hover:text-white"
              >
                {/* <X className="h-5 w-5" /> */}
              </button>
            </div>
            <div className="overflow-y-auto pr-2 flex-grow">
              {/* <EditSongForm
                song={editingSong}
                onSave={handleEditSong}
                onCancel={() => setEditingSong(null)}
              /> */}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal - Lista de canciones */}
      <main className="max-w-6xl mx-auto p-6">
        {songs.length === 0 ? (
          <div className="text-center py-20">
            {/* <Music className="h-16 w-16 mx-auto text-gray-500 mb-4" /> */}
            <h2 className="text-xl font-circular mb-2">
              No hay canciones guardadas
            </h2>
            <p className="text-gray-400 font-circular mb-6">
              Añade tu primera canción para comenzar
            </p>
            <button
              className="btn btn-success"
              onClick={() => console.log("Add Song")}
            >
              Añadir Canción
            </button>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-circular mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-gray-400 font-circular">
              Intenta con otra búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800/50 hover:bg-gray-700/50 transition-colors rounded-lg overflow-hidden relative"
              >
                {/* Área para reproducir */}
                <div
                  className="aspect-square bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center cursor-pointer"
                  onClick={() => console.log("Play", song)}
                >
                  {/* <Music className="h-16 w-16 text-white/70" /> */}
                </div>

                {/* Información y botón de editar */}
                <div className="p-4 flex justify-between items-start">
                  <div
                    className="cursor-pointer"
                    onClick={() => console.log("Play", song)}
                  >
                    <h3 className="font-circular font-medium text-white truncate">
                      {song.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-circular text-sm text-gray-400">
                        {song.lyrics.split("\n").length} líneas
                      </p>
                      {countVoices(song) > 1 && (
                        <span className="text-xs bg-purple-900/50 px-2 py-0.5 rounded font-circular">
                          {countVoices(song)} voces
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón de editar simplificado */}
                  <button
                    // variant="ghost"
                    // size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={(e) => console.log("Edit", e)}
                  >
                    {/* <Edit className="h-4 w-4" /> */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
