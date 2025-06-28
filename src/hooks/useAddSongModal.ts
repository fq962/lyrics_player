import { useState } from "react";
import { NewSongData } from "@/types/song";

export const useAddSongModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSave = (songData: NewSongData) => {
    // Aquí puedes agregar la lógica para guardar la canción
    // Por ejemplo, llamar a una API, actualizar el estado global, etc.
    console.log("Nueva canción:", songData);

    // Aquí podrías dispatch a un store global, hacer un POST request, etc.
    // Ejemplo:
    // await saveSong(songData);
    // onSongAdded?.(songData);

    closeModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    handleSave,
  };
};
