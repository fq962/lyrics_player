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

// Tipos para la base de datos
export interface DbSong {
  id: number;
  title: string;
  lyrics: string;
}

export interface DbVoice {
  id: number;
  song_id: number;
  name: string;
  color: string;
}

export interface DbVoiceSegment {
  id: number;
  song_id: number;
  voice_id: number;
  start_pos: number;
  end_pos: number;
}

// Tipos para el frontend
export interface Voice {
  id: string;
  name: string;
  color: string;
}

export interface TextAssignment {
  id: string;
  text: string;
  voiceId: string;
  startIndex: number;
  endIndex: number;
}

export interface SongWithVoices extends Song {
  voices: Voice[];
  textAssignments: TextAssignment[];
}

export interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    song: NewSongData,
    voices: Voice[],
    textAssignments: TextAssignment[]
  ) => void;
  editingSong?: Song | null;
  mode?: "add" | "edit";
}

export type SongModalTab = "basic" | "voices" | "preview";
