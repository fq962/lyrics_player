"use client";

import React from "react";
import { AddSongModal } from "./AddSongModal";
import { useAddSongModal } from "@/hooks/useAddSongModal";
import { Button } from "@/components/ui/Button";

// EJEMPLO DE USO DEL MODAL
// Puedes copiar este código donde necesites usar el modal

export const ExampleUsage: React.FC = () => {
  const { isOpen, openModal, closeModal, handleSave } = useAddSongModal();

  return (
    <div className="p-8">
      {/* Botón para abrir el modal */}
      <Button
        label="Añadir Nueva Canción"
        onClick={openModal}
        variant="primary"
        size="large"
      />

      {/* Modal */}
      <AddSongModal isOpen={isOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
};

// OTRO EJEMPLO CON MANEJO PERSONALIZADO:
/*
export const CustomUsage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCustom = async (songData: NewSongData) => {
    try {
      // Tu lógica personalizada aquí
      console.log('Guardando canción:', songData);
      
      // Ejemplo: enviar a API
      // const response = await fetch('/api/songs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(songData)
      // });
      
      // Cerrar modal después de guardar
      setIsModalOpen(false);
      
      // Mostrar mensaje de éxito
      alert('¡Canción guardada exitosamente!');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la canción');
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Abrir Modal
      </button>
      
      <AddSongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustom}
      />
    </div>
  );
};
*/
