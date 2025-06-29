export interface Song {
  id: string;
  title: string;
  lyrics: string;
  artist?: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewSongData {
  title: string;
  lyrics: string;
  artist?: string;
}

export interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (song: NewSongData) => void;
  editingSong?: Song | null;
  mode?: "add" | "edit";
}

export type SongModalTab = "basic" | "voices" | "preview";
