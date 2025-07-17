import { useState } from "react";
import { NewSongData, Voice, TextAssignment } from "@/types/song";
import { SongsService } from "@/lib/songsService";

export const useAddSongModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleSave = async (
    songData: NewSongData,
    voices: Voice[],
    textAssignments: TextAssignment[]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await SongsService.saveSong(
        songData,
        voices,
        textAssignments
      );

      if (result.success) {
        console.log("Canción guardada exitosamente:", result.songId);
        closeModal();
        // Aquí podrías agregar notificaciones de éxito o actualizar una lista de canciones
      } else {
        setError(result.error || "Error al guardar la canción");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Error inesperado al guardar la canción");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    error,
    openModal,
    closeModal,
    handleSave,
  };
};
