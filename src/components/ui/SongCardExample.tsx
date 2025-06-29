"use client";

import React from "react";
import { SongCard } from "./SongCard";

// EJEMPLO DE USO DEL SONG CARD
// Puedes copiar este código donde necesites mostrar las canciones

export const SongCardExample: React.FC = () => {
  const sampleSongs = [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      linesCount: 66,
      gradient: "from-purple-500 to-pink-500", // Púrpura como en tu imagen
    },
    {
      id: "2",
      title: "Imagine",
      linesCount: 32,
      gradient: "from-blue-500 to-cyan-500", // Azul
    },
    {
      id: "3",
      title: "Hotel California",
      linesCount: 78,
      gradient: "from-orange-500 to-red-500", // Naranja-Rojo
    },
    {
      id: "4",
      title: "Stairway to Heaven",
      linesCount: 95,
      gradient: "from-green-500 to-blue-500", // Verde-Azul
    },
  ];

  const handlePlay = (songId: string, title: string) => {
    console.log(`Reproducir canción: ${title}`);
    // Aquí implementarías la lógica para reproducir la canción
  };

  const handleEdit = (songId: string, title: string) => {
    console.log(`Editar canción: ${title}`);
    // Aquí implementarías la lógica para editar la canción
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Mis Canciones</h2>

      {/* Grid de canciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sampleSongs.map((song) => (
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

      {/* Ejemplo de card individual */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-white mb-4">
          Ejemplo individual:
        </h3>
        <div className="max-w-xs">
          <SongCard
            title="Mi Canción Favorita"
            linesCount={42}
            gradient="from-purple-500 to-pink-500"
            onPlay={() => console.log("¡Reproducir!")}
            onEdit={() => console.log("¡Editar!")}
          />
        </div>
      </div>
    </div>
  );
};

// OTROS GRADIENTES DISPONIBLES:
/*
Púrpura (como tu imagen): "from-purple-500 to-pink-500"
Azul océano: "from-blue-500 to-cyan-500"
Atardecer: "from-orange-500 to-red-500"
Bosque: "from-green-500 to-blue-500"
Dorado: "from-yellow-500 to-orange-500"
Noche: "from-indigo-500 to-purple-500"
Rosa: "from-pink-500 to-rose-500"
Menta: "from-emerald-500 to-teal-500"
*/

export default SongCardExample;
