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
}

export type SongModalTab = "basic" | "voices" | "preview";
