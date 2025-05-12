export interface Voice {
  id: string;
  name: string;
  color: string;
}

export interface VoicePart {
  voiceId: string;
  startIndex: number;
  endIndex: number;
}

export interface Song {
  id: string;
  title: string;
  lyrics: string;
  voices: Voice[];
  voiceParts: VoicePart[];
  createdAt: string;
  updatedAt?: string;
}
