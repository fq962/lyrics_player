"use client";

import { Button } from "@/components/ui";

export default function Home() {
  const handleAddSong = () => {
    console.log("Añadiendo canción...");
    // Aquí se implementaría la lógica para añadir una canción
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Buscando:", e.target.value);
    // Aquí se implementaría la lógica de búsqueda
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
                onClick={handleAddSong}
                variant="success"
                size="medium"
                fullWidth={true}
                className="sm:w-auto sm:min-w-[160px] py-3 sm:py-4"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Empty State */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
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
              onClick={handleAddSong}
              variant="success"
              size="large"
              fullWidth={true}
              className="sm:w-auto sm:min-w-[200px] sm:mx-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
